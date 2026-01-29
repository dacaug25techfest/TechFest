Write-Host "Starting Attendee Service..." -ForegroundColor Green
Set-Location -Path "Attendee"
& .\mvnw.cmd spring-boot:run
