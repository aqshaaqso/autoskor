# Test middleware API dari PowerShell
# Usage:
#   .\scripts\test-middleware.ps1
#   .\scripts\test-middleware.ps1 -JobId "ed064cfe-b3ae-4a59-b7dc-7af831582682"
#   .\scripts\test-middleware.ps1 -EngineToken "token-dari-backend"

param(
    [string]$BaseUrl = "http://172.16.210.244:8000/api",
    [string]$JobId = "",
    [string]$EngineToken = ""
)

function Show-Title($text) {
    Write-Host ""
    Write-Host "=== $text ===" -ForegroundColor Cyan
}

function Show-Json($obj) {
    $obj | ConvertTo-Json -Depth 8
}

try {
    Show-Title "Health"
    Show-Json (Invoke-RestMethod -Method GET -Uri "$BaseUrl/health")

    Show-Title "List jobs (limit 3)"
    $list = Invoke-RestMethod -Method GET -Uri "$BaseUrl/scoring-jobs?limit=3&offset=0"
    Show-Json $list

    if (-not $JobId -and $list.data.Count -gt 0) {
        $JobId = $list.data[0].id
        Write-Host "Pakai job pertama: $JobId" -ForegroundColor Yellow
    }

    if (-not $JobId) {
        Write-Host "Tidak ada job. Upload dulu lewat UI." -ForegroundColor Red
        exit 1
    }

    Show-Title "Job detail: $JobId"
    $job = Invoke-RestMethod -Method GET -Uri "$BaseUrl/scoring-jobs/$JobId"
    Show-Json $job

    $engineJobId = $job.engine_job_id
    if (-not $engineJobId) {
        Write-Host "engine_job_id kosong di job ini." -ForegroundColor Red
        exit 1
    }

    Show-Title "Download file"
    $outFile = Join-Path $PSScriptRoot "downloaded-$JobId.pdf"
    Invoke-RestMethod -Method GET -Uri "$BaseUrl/scoring-jobs/$JobId/file?disposition=inline" -OutFile $outFile
    Write-Host "Tersimpan: $outFile ($((Get-Item $outFile).Length) bytes)" -ForegroundColor Green

    if (-not $EngineToken) {
        Show-Title "Callback dilewati"
        Write-Host "Tanpa -EngineToken, callback progress/result tidak dijalankan." -ForegroundColor Yellow
        Write-Host "Contoh:" -ForegroundColor Yellow
        Write-Host "  .\scripts\test-middleware.ps1 -JobId `"$JobId`" -EngineToken `"TOKEN_KAMU`"" -ForegroundColor Gray
        exit 0
    }

    Show-Title "Callback progress"
    $progressBody = @{
        progress_percent  = 50
        engine_job_id     = $engineJobId
        status            = "running"
        message           = "manual test from PowerShell"
        current_task_type = "scoring"
    } | ConvertTo-Json

    $progress = Invoke-RestMethod `
        -Method POST `
        -Uri "$BaseUrl/engine-callback/scoring-jobs/$JobId/progress" `
        -ContentType "application/json" `
        -Headers @{ "X-Engine-Token" = $EngineToken } `
        -Body $progressBody
    Show-Json $progress

    Show-Title "Callback result"
    $resultBody = @{
        engine_job_id = $engineJobId
        result_data   = @{
            totalSkorParsial    = 64.35
            persentaseParsial   = 75.7
            predikat            = "CUKUP SEHAT"
        }
    } | ConvertTo-Json -Depth 6

    $result = Invoke-RestMethod `
        -Method POST `
        -Uri "$BaseUrl/engine-callback/scoring-jobs/$JobId/result" `
        -ContentType "application/json" `
        -Headers @{ "X-Engine-Token" = $EngineToken } `
        -Body $resultBody
    Show-Json $result

    Show-Title "Job detail setelah callback"
    Show-Json (Invoke-RestMethod -Method GET -Uri "$BaseUrl/scoring-jobs/$JobId")
}
catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    }
    exit 1
}