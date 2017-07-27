/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var IndTID;
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function TempControlMode()
{
    var tempMode = document.getElementById("T_01").value;
    var Lvl1 = document.getElementById("Lvl1");
    var Lvl2 = document.getElementById("Lvl2");

    if (tempMode == 0)
    {
        Lvl1.style.display = 'none';
        Lvl2.style.display = 'block';
    }   
    else
    {
        Lvl1.style.display = 'block';
        Lvl2.style.display = 'none';
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function DhcpMode()
{
    var dchpMode    = document.getElementById("N_01").value;
    var ipAddr      = document.getElementById("N_02");
    var subnetMask  = document.getElementById("N_03");
    var gateway     = document.getElementById("N_04");

    if (dchpMode == 0)
    {
        ipAddr.disabled     = true;
        subnetMask.disabled = true;
        gateway.disabled    = true;
    }   
    else
    {
        ipAddr.disabled     = false;
        subnetMask.disabled = false;
        gateway.disabled    = false;
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function IrrigationMode()
{
    var irrigationMode = document.getElementById("I_01").value;
    var Lvl1 = document.getElementById("Lvl1");
    
    if (irrigationMode == 2)
    {
        Lvl1.style.display = 'block';
    }
    else
    {
        Lvl1.style.display = 'none';
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function ResetFactorySettings()
{
    alert("Settings has been reset to the default!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function ResetDevice()
{
    alert("Device has been reset!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function SaveNetworkSettings()
{
    alert("Network settings saved!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function SaveLightSettings()
{
    alert("Light settings saved!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function SaveTempFanSettings()
{
    alert("Temp/Fan settings saved!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function SaveIrrigationSettings()
{
    alert("Irrigation settings saved!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function CalibrateProbe()
{
    alert("Calibration started!");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function CheckIP(AIP, AAllow00, AAllowFF)
{
    if (AIP && AIP !== "")
    {
        var Pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
        var A = AIP.match(Pattern);
        if (A && (A.length == 5) )
        {
            for (i = 1; i < 5; i++)	
                if ( (A[i] < 0) || (A[i] > 255) )
                    return false;

            if (!AAllow00)
                if (A[1] == 0 && A[2] == 0 && A[3] == 0 && A[4] == 0)
                    return false;

            if (!AAllowFF)
                if (A[1] == 255 && A[2] == 255 && A[3] == 255 && A[4] == 255)
                    return false;

            return true;
        }
    }
    else 
    {
        return false;
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function CheckShortTime(ATime)
{
    if (ATime && ATime !== "")
    {
        var Pattern = /^(\d{1,2})\:(\d{1,2})$/;
        var A = ATime.match(Pattern);
        if ((A) && (A.length == 3) && (A[1] < 24) && (A[2] < 60) )
            return true;
        else 
            return false;
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function SetIndexTimers()
{
    IndTID = setInterval('updateClock()', 1000 );
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function OnIndexLoad()
{
    updateClock();
    IndTID = setInterval('updateClock()', 1000 );
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function updateClock()
{
    var dateTimeObj = new Date();
    
    var hoursStr = dateTimeObj.getHours();
    if (hoursStr < 10) hoursStr = "0" + hoursStr;
    
    var minutesStr = dateTimeObj.getMinutes();
    if (minutesStr < 10) minutesStr = "0" + minutesStr;
    
    var secondsStr = dateTimeObj.getSeconds();
    if (secondsStr < 10) secondsStr = "0" + secondsStr;
    
    var timeString = hoursStr + ":" + minutesStr + ":" + secondsStr;

    var monthDayStr = dateTimeObj.getDate();
    if (monthDayStr < 10) monthDayStr = "0" + monthDayStr;
    
    var monthStr = (dateTimeObj.getMonth() + 1);
    if (monthStr < 10) monthStr = "0" + monthStr;
       
    var dateString = monthDayStr + "/" + monthStr + "/" + dateTimeObj.getFullYear();
 
    document.getElementById("T_01").value = timeString;
    document.getElementById("T_02").value = dateString;
}