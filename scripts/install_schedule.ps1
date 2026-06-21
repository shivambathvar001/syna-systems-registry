#Requires -Version 5.1
<#
.SYNOPSIS
    Install or remove the SynaSystems-Watchdog Windows Scheduled Task.

.DESCRIPTION
    Uses schtasks.exe to import schedule_watchdog.xml and register a daily
    weekday (Mon-Fri) task that runs watchdog.py at 11:00 AM IST.

.PARAMETER Action
    'install'  - Register the task (default)
    'uninstall'- Delete the task

.EXAMPLE
    # Install
    powershell -ExecutionPolicy Bypass -File install_schedule.ps1

    # Uninstall / cleanup
    powershell -ExecutionPolicy Bypass -File install_schedule.ps1 -Action uninstall

.NOTES
    Run this script from the SynaSystems/scripts/ directory, or adjust $ScriptDir.
#>
param(
    [ValidateSet("install", "uninstall")]
    [string]$Action = "install"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Continue"

# === Constants ================================================================
$TaskName  = "SynaSystems-Watchdog"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$XmlPath   = Join-Path $ScriptDir "schedule_watchdog.xml"

# === Helpers ==================================================================
function Write-Banner {
    param([string]$Text, [string]$Color = "Cyan")
    Write-Host ""
    Write-Host ("=" * 60) -ForegroundColor $Color
    Write-Host "  $Text" -ForegroundColor $Color
    Write-Host ("=" * 60) -ForegroundColor $Color
    Write-Host ""
}

function Get-NextRunTime {
    param([string]$Name)
    try {
        $info = schtasks /query /tn $Name /fo LIST /v 2>&1
        $nextLine = $info | Select-String "Next Run Time"
        if ($nextLine) {
            return ($nextLine -split ":")[1..3] -join ":"
        }
    } catch {}
    return "(unable to retrieve)"
}

# === INSTALL ==================================================================
if ($Action -eq "install") {
    Write-Banner "Installing SynaSystems-Watchdog Scheduled Task" "Green"

    # Validate XML exists
    if (-not (Test-Path $XmlPath)) {
        Write-Host "[ERROR] XML file not found: $XmlPath" -ForegroundColor Red
        Write-Host "        Make sure schedule_watchdog.xml is in the same directory." -ForegroundColor Yellow
        exit 1
    }

    # Check if task already exists - delete before re-importing to allow updates
    $existing = schtasks /query /tn $TaskName 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[INFO] Task '$TaskName' already exists. Removing before re-import..." -ForegroundColor Yellow
        schtasks /delete /tn $TaskName /f | Out-Null
        Write-Host "[OK]   Old task removed." -ForegroundColor Yellow
    }

    Write-Host "[INFO] Importing task from: $XmlPath" -ForegroundColor Cyan

    # --- schtasks /create with XML ---
    $result = schtasks /create /xml "$XmlPath" /tn $TaskName 2>&1

    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] schtasks failed. Output:" -ForegroundColor Red
        Write-Host $result -ForegroundColor Red
        Write-Host ""
        Write-Host "[TIP]  Try running this script as Administrator." -ForegroundColor Yellow
        exit 1
    }

    Write-Host "[OK]   Task registered successfully!" -ForegroundColor Green
    Write-Host ""

    # --- Confirmation query ---
    Write-Host "[INFO] Verifying registration..." -ForegroundColor Cyan
    $query = schtasks /query /tn $TaskName /fo LIST /v 2>&1
    $statusLine = $query | Select-String "Status"
    if ($statusLine) {
        Write-Host "       $statusLine" -ForegroundColor White
    }

    # --- Next run time ---
    $nextRun = Get-NextRunTime -Name $TaskName
    Write-Host ""
    Write-Host "[INFO] Next scheduled run: $nextRun" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "---------------------------------------------------------" -ForegroundColor DarkGray
    Write-Host "  Task '$TaskName' is now ACTIVE." -ForegroundColor Green
    Write-Host "  Runs: Monday-Friday at 11:00 AM IST" -ForegroundColor Green
    Write-Host "  Script: D:\ShivamGem\SynaSystems\scripts\watchdog.py" -ForegroundColor Green
    Write-Host "---------------------------------------------------------" -ForegroundColor DarkGray
    Write-Host ""
} elseif ($Action -eq "uninstall") {
    Write-Banner "Removing SynaSystems-Watchdog Scheduled Task" "Yellow"

    $existing = schtasks /query /tn $TaskName 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[WARN] Task '$TaskName' not found. Nothing to remove." -ForegroundColor Yellow
        exit 0
    }

    Write-Host "[INFO] Deleting task: $TaskName" -ForegroundColor Cyan
    schtasks /delete /tn $TaskName /f

    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK]   Task '$TaskName' deleted successfully." -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Failed to delete task. Try running as Administrator." -ForegroundColor Red
        exit 1
    }
}
