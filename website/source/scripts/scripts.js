/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/////////////////////////////////////////////////////////////////////////////////////////////////////////
function TempControlMode()
{
	var tempMode = document.getElementById("T_01").value;
	var syncLvl1 = document.getElementById("syncLvl1");
	var syncLvl2 = document.getElementById("syncLvl2");
        
        if (tempMode == 0)
        {
            syncLvl1.style.display = 'none';
            syncLvl2.style.display = 'block';
        }   
        else
        {
            syncLvl1.style.display = 'block';
            syncLvl2.style.display = 'none';
        }
}

function NetworkSettings()
{
	var dchpMode = document.getElementById("N_01").value;
	var syncLvl1 = document.getElementById("syncLvl1");
	var syncLvl2 = document.getElementById("syncLvl2");
        
        if (dchpMode == 0)
        {
            syncLvl1.style.display = 'block';
            syncLvl2.style.display = 'none';
        }   
        else
        {
            syncLvl1.style.display = 'none';
            syncLvl2.style.display = 'block';
        }
}