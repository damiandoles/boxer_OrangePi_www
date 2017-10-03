/////////////////////////////////////////////////////////////////////////////////////////////////////////
var timeDateTimer = null;
var getMeasurementsTimer = null;
var xhr = null;
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

    if (dchpMode == 1)
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
    try
    {
        if (window.XMLHttpRequest) //every browsers without IE 
        {
            xhr = new XMLHttpRequest();
        }
        else 
        {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xhr.open("HEAD", "FactoryDef", true);
        xhr.setRequestHeader("Content-type", "text/plain");

        xhr.onreadystatechange = function() 
        {
            //Call a function when the state changes.
            if (xhr.readyState === xhr.DONE && xhr.status === 200) 
            {
                xhr = null;
                console.log("FactoryDef respose OK\r\n");
            }
        };
        xhr.send(null);

        console.log("Settings has been reset to the default!");
    }
    catch (err)
    {
        console.log(err);
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function ResetDevice()
{
    try
    {
        if (window.XMLHttpRequest) //every browsers without IE 
        {
            xhr = new XMLHttpRequest();
        }
        else 
        {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xhr.open("HEAD", "Reset", true);
        xhr.setRequestHeader("Content-type", "text/plain");

        xhr.onreadystatechange = function() 
        {
            //Call a function when the state changes.
            if (xhr.readyState === xhr.DONE && xhr.status === 200) 
            {
                xhr = null;
                console.log("Reset respose OK\r\n");
            }
        };
        xhr.send(null);

        console.log("Device has been reset!");
    }
    catch (err)
    {
        console.log(err);
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function SaveNetworkSettings()
{
    var dataError = false;
    var dhcpMode  = parseInt(document.getElementById("N_01").value, 10);
    var ipAddr    = document.getElementById("N_02").value;
    var mask      = document.getElementById("N_03").value;
    var gateway   = document.getElementById("N_04").value;

    switch (dhcpMode)
    {
        case 0:
            //wlacz dhcp
            ipAddr = "--";
            mask = "--";
            gateway = "--";
            break;
            
        case 1:
            var ipProper =  ValidateIPaddress(ipAddr);
            var maskProper =  ValidateIPaddress(mask);
            var gatewayProper =  ValidateIPaddress(gateway);

            if (!ipProper)
            {
                dataError = true;
                document.getElementById("N_02Error").innerHTML = "&nbsp;&nbsp;&nbsp;Use proper IP address format (xxx.xxx.xxx.xxx)!";
            }
            else
            {
                document.getElementById("N_02Error").innerHTML = ""; 
            }
            
            if (!maskProper)
            {
                dataError = true;
                document.getElementById("N_03Error").innerHTML = "&nbsp;&nbsp;&nbsp;Use proper subnet mask format (xxx.xxx.xxx.xxx)!";
            }
            else
            {
                document.getElementById("N_03Error").innerHTML = "";                
            }
            
            if (!gatewayProper)
            {
                dataError = true;
                document.getElementById("N_04Error").innerHTML = "&nbsp;&nbsp;&nbsp;Use proper gateway format (xxx.xxx.xxx.xxx)!";                
            }
            else
            {
                document.getElementById("N_04Error").innerHTML = "";
            }
            break;
        
        default:
            dataError = true;
            break;
    }
    
    if (!dataError)
    {
        try
        {
            if (window.XMLHttpRequest) //every browsers without IE 
            {
                xhr = new XMLHttpRequest();
            }
            else 
            {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }

            var url = "SaveNetwork";
            var params = 
                "dhcpMode="   + dhcpMode +
                "&ipAddr="    + ipAddr +
                "&mask="      + mask +
                "&gateway="   + gateway;

            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            xhr.onreadystatechange = function() 
            {
                //Call a function when the state changes.
                if (xhr.readyState === xhr.DONE && xhr.status === 200) 
                {
                    xhr = null;
                    console.log("SaveNetwork respose OK\r\n");
                }
            };
            xhr.send(params);

            console.log("Network settings saved!");
        }
        catch (err)
        {
            console.log(err);
        }
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function SaveLightSettings()
{
    var dataError = false;
    var timeOn   = parseInt(document.getElementById("L_01").value, 10);
    var timeOff  = parseInt(document.getElementById("L_02").value, 10);
    var stateOn  = document.getElementById("L_03").checked;
    var stateOff = document.getElementById("L_04").checked;
    var startNow = document.getElementById("L_05").checked;
    var startAtTime = document.getElementById("L_06").checked;
    var turnOnOffTime = document.getElementById("L_07").value;
    
    if (timeOn < 0 || timeOn > 24 || isNaN(timeOn))
    {
        dataError = true;
        document.getElementById("L_01Error").innerHTML = "&nbsp;&nbsp;&nbsp;Use number between 0 and 24!";
    }
    else
    {
        document.getElementById("L_01Error").innerHTML = "";        
    }
    
    if (timeOff < 0 || timeOff > 24 || isNaN(timeOff))
    {
        dataError = true;
        document.getElementById("L_02Error").innerHTML = "&nbsp;&nbsp;&nbsp;Use number between 0 and 24!";
    }
    else
    {
        document.getElementById("L_02Error").innerHTML = ""; 
    }
    
    if (!stateOn && !stateOff)
    {
        dataError = true;
        document.getElementById("stateError").innerHTML = "&nbsp;&nbsp;&nbsp;Check initial state!";
    }
    else
    {
        document.getElementById("stateError").innerHTML = "";
    }
    
    if (!startNow && !startAtTime)
    {
        dataError = true;
        document.getElementById("startModeError").innerHTML = "&nbsp;&nbsp;&nbsp;Check start mode!";
    }
    else
    {
        document.getElementById("startModeError").innerHTML = "";
    }
    
    if (!CheckShortTime(turnOnOffTime))
    {
        dataError = true;
        document.getElementById("L_07Error").innerHTML = "&nbsp;Wrong turn on/off time!";
    }
    else
    {
        document.getElementById("L_07Error").innerHTML = "";
    }
    
    if (!dataError)
    {
        if (timeOn + timeOff === 24)
        {
            // zapis do urzadzenia
            //state: 0 - off, 1 - on
            var initState;
            if (stateOn && !stateOff)
            {
                initState = 1;
            }
            else
            {
                initState = 0;
            }
            
            //start: 0 - now, 1 - at time
            var startMode;
            if (startNow && !startAtTime)
            {
                startMode = 0;
            }
            else
            {
                startMode = 1;
            }
            
            try
            {
                if (window.XMLHttpRequest) //every browsers without IE 
                {
                    xhr = new XMLHttpRequest();
                }
                else 
                {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }
                
                var url = "SaveLamp";
                var params = 
                    "timeOn="           + timeOn +
                    "&timeOff="         + timeOff +
                    "&initState="       + initState +
                    "&startMode="       + startMode +
                    "&turnOnOffTime="   + turnOnOffTime;
                
                xhr.open("POST", url, true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                xhr.onreadystatechange = function() 
                {
                    //Call a function when the state changes.
                    if (xhr.readyState === xhr.DONE && xhr.status === 200) 
                    {
                        xhr = null;
                        console.log("SaveLamp respose OK\r\n");
                    }
                };
                xhr.send(params);

                console.log("Light settings saved!");
            }
            catch (err)
            {
                console.log(err);
            }
        }
        else
        {
            console.log("Sum of times (on+off) must equal 24 hours!");
        }
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function SaveTempFanSettings()
{
    var dataError = false;
    var tempCtrlMode  = document.getElementById("T_01").value;
    var tempMax = parseFloat(document.getElementById("T_02").value, 10);
    var pushFanPower = parseInt(document.getElementById("T_03").value, 10);
    var pullFanPower = parseInt(document.getElementById("T_04").value, 10);
    
    switch (tempCtrlMode)
    {
        case "0":
            if (isNaN(pushFanPower) || pushFanPower < 0 || pushFanPower > 100)
            {
                dataError = true;
                document.getElementById("T_03Error").innerHTML = "&nbsp;&nbsp;&nbsp;Wrong power of push FAN! Please select value from 0 to 100%";
            }
            else
            {
                document.getElementById("T_03Error").innerHTML = "";
            }
            
            if (isNaN(pullFanPower) || pullFanPower < 0 || pullFanPower > 100)
            {
                dataError = true;
                document.getElementById("T_04Error").innerHTML = "&nbsp;&nbsp;&nbsp;Wrong power of pull FAN! Please select value from 0 to 100%";
            }
            else
            {
                document.getElementById("T_04Error").innerHTML = "";
            } 
            break;
            
        case "1":
            if (isNaN(tempMax) || tempMax < 20 || tempMax > 32)
            {
                dataError = true;
                document.getElementById("T_02Error").innerHTML = "&nbsp;&nbsp;&nbsp;Wrong max temp value! Please select value from 20 to 32°C";
            }
            else
            {
                document.getElementById("T_02Error").innerHTML = "";
            }
            break;
            
        default:
            dataError = true;
            break;
    }
    
    if (!dataError)
    {
        try
        {
            if (window.XMLHttpRequest) //every browsers without IE 
            {
                xhr = new XMLHttpRequest();
            }
            else 
            {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
            
            var url = "SaveTempFan";
            var params = 
                "tempCtrlMode="   + tempCtrlMode +
                "&tempMax="       + tempMax +
                "&pushFanPower="  + pushFanPower +
                "&pullFanPower="  + pullFanPower;

            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function() 
            {
                //Call a function when the state changes.
                if (xhr.readyState === xhr.DONE && xhr.status === 200) 
                {
                    xhr = null;
                    console.log("SaveTempFan respose OK\r\n");
                }
            };
            
            xhr.send(params);
            console.log("Temp/Fan settings saved!");
        }
        catch (err)
        {
            console.log(err);
        }  
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function SaveIrrigationSettings()
{
    var dataError = false;
    var irrMode  = document.getElementById("I_01").value;
    var waterAmount = parseInt(document.getElementById("I_02").value, 10);
    var irrFreq = parseInt(document.getElementById("I_03").value, 10);
    var startTime = document.getElementById("I_04").value;
    
    dataError = CheckIrrWaterAmount(waterAmount);
    
    if (irrMode == "2")
    {
        if (isNaN(irrFreq) || irrFreq < 0 || irrFreq > 7) //days
        {
            dataError = true;
            document.getElementById("I_03Error").innerHTML = "&nbsp;&nbsp;&nbsp;Wrong frequency! Please select value from 1 to 7 days";
        }
        else
        {
            document.getElementById("I_03Error").innerHTML = "";
        }
        
        if (!CheckShortTime(startTime))
        {
            dataError = true;
            document.getElementById("I_04Error").innerHTML = "&nbsp;&nbsp;&nbsp;Wrong turn on time!";
        }
        else
        {
            document.getElementById("I_04Error").innerHTML = "";
        }        
    }
    
    if (!dataError)
    {
        try
        {
            if (window.XMLHttpRequest) //every browsers without IE 
            {
                xhr = new XMLHttpRequest();
            }
            else 
            {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
            
            var url = "SaveIrr";
            var params = 
                "irrMode="      + irrMode +
                "&waterAmount=" + waterAmount +
                "&irrFreq="     + irrFreq +
                "&startTime="   + startTime;

            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            xhr.onreadystatechange = function() 
            {
                //Call a function when the state changes.
                if (xhr.readyState === xhr.DONE && xhr.status === 200) 
                {
                    xhr = null;
                    console.log("SaveIrr respose OK\r\n");
                }
            };
            
            xhr.send(params);
            console.log("Irrigation settings saved!\r\n");
        }
        catch (err)
        {
            console.log(err);
        }
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function CheckIrrWaterAmount(waterAmount)
{
    var dataError = false;
    if (isNaN(waterAmount) || waterAmount < 100 || waterAmount > 3000) //ml
    {
        dataError = true;
        document.getElementById("I_02Error").innerHTML = "&nbsp;&nbsp;&nbsp;Wrong amount of water! Please select value from 100 to 3000ml";
    }
    else
    {
        document.getElementById("I_02Error").innerHTML = "";
    } 
    
    return dataError;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function CalibrateProbe()
{
    var dataError = false;
    var waterProbe  = document.getElementById("P_01").checked;
    var soilProbe = document.getElementById("P_02").checked;
    
    if (!waterProbe && !soilProbe)
    {
        dataError = true;
        document.getElementById("phcalibError").innerHTML = "&nbsp;&nbsp;&nbsp;Select one of available probes!";
    }
    else
    {
        document.getElementById("phcalibError").innerHTML = "";
    }
    
    if (!dataError)
    {
        var probeType;
        if (waterProbe)
        {
            probeType = 1;
            console.log("Calibration of water probe started!"); 
        }
        else
        {
            probeType = 2;
            console.log("Calibration of soil probe started!"); 
        }
        
        try
        {
            if (window.XMLHttpRequest) //every browsers without IE 
            {
                xhr = new XMLHttpRequest();
            }
            else 
            {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
            
            var url = "SaveCalibPh";
            var params = "probeType=" + probeType;

            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            xhr.onreadystatechange = function() 
            {
                //Call a function when the state changes.
                if (xhr.readyState === xhr.DONE && xhr.status === 200) 
                {
                    xhr = null;
                    console.log("SaveCalibPh respose OK\r\n");
                }
            };
            xhr.send(params);
        }
        catch (err)
        {
            console.log(err);
        }
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function ValidateIPaddress(ipaddress) 
{  
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) 
    {  
        return (true);  
    }  
    else
        return (false);
}  
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function CheckShortTime(ATime)
{
    if (ATime && ATime !== "")
    {
        var Pattern = /^(\d{1,2}){2}\:(\d{1,2}){2}$/;
        var A = ATime.match(Pattern);
        if ((A) && (A.length == 3) && (A[1] < 24) && (A[2] < 60) )
            return true;
        else 
            return false;
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function GetIrrigationConfig()
{
    try
    {
        if (window.XMLHttpRequest) //every browsers without IE 
        {
            xhr = new XMLHttpRequest();
        }
        else 
        {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
               
        xhr.open("POST", "GetIrr", true);
        xhr.setRequestHeader("Content-Type", "text/plain;");
        xhr.responseType = "text";
        xhr.overrideMimeType("text/plain; charset=UTF-8");
        xhr.timeout = 5000;
        
        xhr.ontimeout = function () 
        {
            console.log("XMLHttprequest response timeout!\r\n");
        };
        
        xhr.onreadystatechange = function() 
        {
            //Call a function when the state changes.
            if (xhr.readyState === xhr.DONE && xhr.status === 200)  
            {
                console.log("GetIrr respose OK\r\n");
                console.log(xhr.responseText+"\r\n");
                var responseSplit = xhr.responseText.split("\r\n");
                document.getElementById("I_01").value = parseInt(responseSplit[0]);
                document.getElementById("I_02").value = parseInt(responseSplit[1]);
                document.getElementById("I_03").value = parseInt(responseSplit[2]);
                document.getElementById("I_04").value = responseSplit[3];
                IrrigationMode();
                xhr = null;
            }
        };
        xhr.send(null);
    }
    catch (err)
    {
        console.log(err);
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function GetLampConfig()
{
    try
    {
        if (window.XMLHttpRequest) //every browsers without IE 
        {
            xhr = new XMLHttpRequest();
        }
        else 
        {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        xhr.open("POST", "GetLamp", true);
        xhr.setRequestHeader("Content-Type", "text/plain;");
        xhr.responseType = "text";
        xhr.overrideMimeType("text/plain; charset=UTF-8");
        xhr.timeout = 5000;

        xhr.ontimeout = function () 
        {
            console.log("XMLHttprequest response timeout!\r\n");
        };
        
        xhr.onreadystatechange = function() 
        {
            //Call a function when the state changes.
            if (xhr.readyState === xhr.DONE && xhr.status === 200) 
            {
                console.log("GetLamp respose OK\r\n");
                console.log(xhr.responseText+"\r\n");
                var responseSplit = xhr.responseText.split("\r\n");
                document.getElementById("L_01").value = parseInt(responseSplit[0]);
                document.getElementById("L_02").value = parseInt(responseSplit[1]);

                var state = parseInt(responseSplit[2]);
                switch (state)
                {
                case 0:
                    document.getElementById("L_03").disabled = true;
                    document.getElementById("L_04").checked = true;
                    break;

                case 1:
                    document.getElementById("L_03").checked = true;
                    document.getElementById("L_04").disabled = true;                
                    break;

                default:
                    break;
                }

                var startMode = parseInt(responseSplit[3]);
                switch (startMode)
                {
                case 1:
                    document.getElementById("L_05").disabled = true;
                    document.getElementById("L_06").checked = true;
                    break;

                case 0:
                    document.getElementById("L_05").checked = true;
                    document.getElementById("L_06").disabled = true;                
                    break;

                default:
                    break;
                }
                
                document.getElementById("L_07").value = responseSplit[4]; 
                document.getElementById("L_08").value = parseInt(responseSplit[5]);
                document.getElementById("L_09").value = parseInt(responseSplit[6]);  
                LightStateCheckBox();
                LightStartModeCheckBox();
                xhr = null;
            }
        };
        xhr.send(null);
    }
    catch (err)
    {
        console.log(err);
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function GetTempFanConfig()
{
    try
    {
        if (window.XMLHttpRequest) //every browsers without IE 
        {
            xhr = new XMLHttpRequest();
        }
        else 
        {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xhr.open("POST", "GetTempFan", true);
        xhr.setRequestHeader("Content-Type", "text/plain;");
        xhr.responseType = "text";
        xhr.overrideMimeType("text/plain; charset=UTF-8");
        xhr.timeout = 5000;
        
        xhr.ontimeout = function () 
        {
            console.log("XMLHttprequest response timeout!\r\n");
        };
        
        xhr.onreadystatechange = function() 
        {
            //Call a function when the state changes.
            if (xhr.readyState === xhr.DONE && xhr.status === 200) 
            {
                console.log("GetTempFan respose OK\r\n");
                console.log(xhr.responseText+"\r\n");
                var responseSplit = xhr.responseText.split("\r\n");
                document.getElementById("T_01").value = parseInt(responseSplit[0]);
                document.getElementById("T_04").value = parseInt(responseSplit[1]);
                document.getElementById("T_03").value = parseInt(responseSplit[2]);
                document.getElementById("T_02").value = parseFloat(responseSplit[3]);
                TempControlMode();
                xhr = null;
            }
        };
        
        xhr.send(null);  
    }
    catch (err)
    {
        console.log(err);
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function GetAdvancedConfig()
{
    try
    {
        if (window.XMLHttpRequest) //every browsers without IE 
        {
            xhr = new XMLHttpRequest();
        }
        else 
        {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        xhr.open("POST", "GetAdvanced", true);
        xhr.setRequestHeader("Content-Type", "text/plain;");
        xhr.responseType = "text";
        xhr.overrideMimeType("text/plain; charset=UTF-8");
        xhr.timeout = 5000;
        
        xhr.ontimeout = function () 
        {
            console.log("XMLHttprequest response timeout!\r\n");
        };
        
        xhr.onreadystatechange = function() 
        {
            //Call a function when the state changes.
            if (xhr.readyState === xhr.DONE && xhr.status === 200) 
            {
                console.log("GetAdvanced respose OK\r\n");
                console.log(xhr.responseText+"\r\n");
                
                var responseSplit = xhr.responseText.split("\r\n");
                document.getElementById("N_01").value = parseInt(responseSplit[0]);
                document.getElementById("N_02").value = responseSplit[1];
                document.getElementById("N_03").value = responseSplit[2];
                document.getElementById("N_04").value = responseSplit[3]; 
                DhcpMode();
                xhr = null;
            }
        };
        xhr.send(null); 
    }
    catch (err)
    {
        console.log(err);
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function GetMeasurements()
{
    try
    {
        if (window.XMLHttpRequest) //every browsers without IE 
        {
            xhr = new XMLHttpRequest();
        }
        else 
        {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xhr.open("POST", "GetMeas", true);
        xhr.setRequestHeader("Content-Type", "text/plain;");
        xhr.responseType = "text";
        xhr.overrideMimeType("text/plain; charset=UTF-8");
        xhr.timeout = 5000;
        
        xhr.ontimeout = function () 
        {
            console.log("XMLHttprequest response timeout!\r\n");
        };

        xhr.onreadystatechange = function()
        {
            //Call a function when the state changes.
            if (xhr.readyState === xhr.DONE && xhr.status === 200) 
            {
                console.log("GetMeas respose OK\r\n");
                console.log(xhr.responseText);
                var responseSplit = xhr.responseText.split("\r\n");
                
                if (responseSplit[0] == " - - -")
                {
                    document.getElementById("M_01").value = "- - -";
                }
                else
                {
                    document.getElementById("M_01").value = parseInt(responseSplit[0]);
                }
                
                if (responseSplit[1] == "- - -")
                {
                    document.getElementById("M_02").value = responseSplit[1];
                }
                else
                {
                    document.getElementById("M_02").value = parseInt(responseSplit[1]);
                }

                if (responseSplit[2] == "- - -")
                {
                    document.getElementById("M_03").value = responseSplit[2];
                }
                else
                {
                    document.getElementById("M_03").value = parseFloat(responseSplit[2]);
                }

                if (responseSplit[3] == "- - -")
                {
                    document.getElementById("M_04").value = responseSplit[3];
                }
                else
                {
                    document.getElementById("M_04").value = parseFloat(responseSplit[3]);
                }

                if (responseSplit[4] == "- - -")
                {
                    document.getElementById("M_05").value = responseSplit[4];
                }
                else
                {
                    document.getElementById("M_05").value = parseFloat(responseSplit[4]);
                }

                if (responseSplit[5] == "- - -")
                {
                    document.getElementById("M_06").value = responseSplit[5];
                }
                else
                {
                    document.getElementById("M_06").value = parseFloat(responseSplit[5]);
                }

                if (responseSplit[6] == "- - -")
                {
                    document.getElementById("M_07").value = responseSplit[6];
                }
                else
                {
                    document.getElementById("M_07").value = parseFloat(responseSplit[6]);
                }

                document.getElementById("M_08").value = responseSplit[7];
                xhr = null;
            }
        };
        xhr.send(null); 
    }
    catch (err)
    {
        console.log(err);
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function OnAdvancedLoad()
{
    GetAdvancedConfig();
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function OnIrrigationLoad()
{
    GetIrrigationConfig();
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function OnTempFanLoad()
{
    GetTempFanConfig();
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function OnIndexLoad()
{
    TimeDateUpdate();
    GetMeasurements();
    timeDateTimer = setInterval('TimeDateUpdate()', 1000 );
    getMeasurementsTimer = setInterval('GetMeasurements()', 3000 );
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function OnLampLoad()
{
    GetLampConfig();
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function LightStartModeCheckBox()
{
    var startNow  = document.getElementById("L_05");
    var startAtTime = document.getElementById("L_06");  
    var startTime = document.getElementById("L_07");
    
    if (startNow.checked)
    {
        startAtTime.disabled = true;
        startTime.disabled = true;
    }
    else
    {
        startAtTime.disabled = false;
        startTime.disabled = false;
    }
    
    if (startAtTime.checked)
    {
        startNow.disabled = true;
    }
    else
    {
        startNow.disabled = false;
    }
    
    if (!startNow.checked && !startAtTime.checked)
    {
        startTime.disabled = true;
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function LightStateCheckBox()
{
    var stateOn  = document.getElementById("L_03");
    var stateOff = document.getElementById("L_04");   
    
    if (stateOn.checked)
    {
        stateOff.disabled = true;
    }
    else
    {
        stateOff.disabled = false;
    }
    
    if (stateOff.checked)
    {
        stateOn.disabled = true;
    }
    else
    {
        stateOn.disabled = false;
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function PhCalibCheckBox()
{
    var waterProbe = document.getElementById("P_01");
    var soilProbe  = document.getElementById("P_02");   
    
    if (waterProbe.checked)
    {
        soilProbe.disabled = true;
    }
    else
    {
        soilProbe.disabled = false;
    }
    
    if (soilProbe.checked)
    {
        waterProbe.disabled = true;
    }
    else
    {
        waterProbe.disabled = false;
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function TimeDateUpdate()
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