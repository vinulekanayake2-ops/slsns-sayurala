Write-Host "Stopping dev server..." -ForegroundColor Yellow
# Kill any running node processes for this project
Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*node*" } | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "Waiting for processes to stop..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

Write-Host "Applying database migration..." -ForegroundColor Cyan
npx prisma db push

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migration applied successfully!" -ForegroundColor Green
    Write-Host "Starting dev server..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"
    Write-Host "✅ Dev server started in new window!" -ForegroundColor Green
} else {
    Write-Host "❌ Migration failed!" -ForegroundColor Red
}
