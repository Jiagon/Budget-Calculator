(function(){
    "use strict";
    var amount = 0;
    var weeklyAmount = 0;
    var dailyAmount = 0;
    var dateObj = new Date(); //0-31
    
    var month = ["January", "Feburary", "March", "April","May",
                 "June", "July", "August", "September", "October", 
                 "Nomber", "December"];
    
    var calendarHash = {"January": 31, "Feburary": 28, "March": 31, "April": 30, 
                                    "May": 31,"June": 30 , "July": 31, "August": 31, "September": 30, 
                                    "October": 31, "Nomber": 30, "December": 31};

    // Hash table for determining the values of labels
    var labelHash = {};
    // Array list holding the key names for the hash table
    var labelArr = [];
    
    // All displayed ranges
    var allRanges = [];
    
    // All arrays for keeping track of weight, totals in weeks, and totals in days
    var allWeights = [];
    var allTotalWeeks = [];
    var allTotalDays = [];
    
    //this variable will be added or subtracted to get to
    //other months
    var monthNum = dateObj.getMonth();

    var date = undefined; //0-31
    var day= undefined; //string name
    
    //gets changed depending on what month
    var totalWeeks = undefined;
    
    //gets current year
    var year = dateObj.getFullYear();
    
    
    //
    switch(dateObj.getDay()){
        case 0:
            day = "Sunday";
            break;
        case 1:
            day = "Monday";
            break;
        case 2:
            day = "Tuesday";
            break;
        case 3:
            day = "Wednesday";
            break;
        case 4:
            day = "Thursday";
            break;
        case 5:
            day = "Friday";
            break;
        case  6:
            day = "Saturday";   
    }
    
    var foodWeight, billsWeight, savingsWeight, gasWeight;
    var foodTotalWeek, billsTotalWeek, savingsTotalWeek, gasTotalWeek;
    var foodTotalDaily, billsTotalDaily, savingsTotalDaily, gasTotalDaily;

    function init(){
         //call respective functions when buttons are pressed
        document.querySelector('#calcButton').onclick = function(){
            console.log("clicked");
            amount = document.querySelector('#moneyField').value;

            if(!isNaN(amount)){
                weeklyAmount = calcWeekly(amount);
                dailyAmount = calcDaily(amount, month[monthNum]);
            }
            else{
                weeklyAmount = 0;
                dailyAmount = 0;
            }

            calcPercentage();
            addHTML();
        }

        document.querySelector('#addLabelButton').onclick = function(){
            var text = document.querySelector('#addLabelText').value;
            var labels = document.querySelector('#labels');
            console.log(text + ", " + labels);
            addLabel(text, labels);
        };
        
        // Removes a label from the select tag list of labels that is currently selected
        document.querySelector('#removeLabelButton').onclick = function(){
            var labels = document.querySelector('#labels');
            removeLabel(labels);
        }
        
        //calculate how many weeks are in the month
        calcNumOfWeeks();
        
        //sets initial value of sliders
        foodWeight = parseFloat(document.querySelector("#foodRange").value/100);
        billsWeight = parseFloat(document.querySelector("#billsRange").value/100);
        savingsWeight = parseFloat(document.querySelector("#savingsRange").value/100);
        gasWeight = parseFloat(document.querySelector("#gasRange").value/100);

        
        //checks for new slider values when changed
        document.querySelector("#foodRange").onchange = function(e){
            document.querySelector("#foodExpenses").innerHTML = e.target.value + "%";
            foodWeight = e.target.value / 100;
            console.log(foodWeight);
        };

         document.querySelector("#billsRange").onchange = function(e){
            document.querySelector("#billsExpenses").innerHTML = e.target.value + "%";
            billsWeight = e.target.value / 100;
        };

         document.querySelector("#savingsRange").onchange = function(e){
            document.querySelector("#savingsExpenses").innerHTML = e.target.value + "%";
            savingsWeight = e.target.value / 100;
        };

         document.querySelector("#gasRange").onchange = function(e){
            document.querySelector("#gasExpenses").innerHTML = e.target.value + "%";
            gasWeight = e.target.value / 100;
             console.log(gasWeight);
        };         
        
        labelHash.length = 0;
        
        addHash("food");
        addHash("bills");
        addHash("savings");
        addHash("gas");
    }

    function calcWeekly(money){
        return (money/totalWeeks).toFixed(2);
    }

    function calcDaily(money, month){
        return (money/calendarHash[month]).toFixed(2);
    }

    //adds new body of html to test calculations
    function addHTML(){
        var div = document.querySelector("#results");

        //var bigString = "<br><h3>Calculations for " + //month[monthNum]+" of "+ year+": </h3>";
        var bigString = "<p>Results: </p>";
        //bigString += "<p>Number of weeks in this month:" + totalWeeks + "</p>";
        //add html for weeks
        for(var i=1; i<=totalWeeks; i++){
            bigString += "<p>Week "+ i + ": $" + weeklyAmount + " </p>";
        }

        //add html for days
        for(var i=1; i<=calendarHash[month[monthNum]]; i++){
           bigString += "<p>Day: "+ i + ": $" + dailyAmount + " </p>" ;
        }

         bigString += "<p>weekly food budget: "+ foodTotalWeek + " </p>" ;
         bigString += "<p>daily food budget per week: "+ foodTotalDaily + " </p>" ;

        bigString += "<br>";
        div.innerHTML = bigString;
    }
    
    //calculates how money should be spent in certain categories
    //based on user preferences
    function calcPercentage(){
        
        foodTotalWeek = (weeklyAmount * foodWeight).toFixed(2);
        foodTotalDaily = (foodTotalWeek /7).toFixed(2);
        
        billsTotalWeek = (weeklyAmount * billsWeight).toFixed(2);
        billsTotalDaily = (billsTotalWeek /7).toFixed(2);
        
        savingsTotalWeek = (weeklyAmount * savingsWeight).toFixed(2);
        savingsTotalDaily = (savingsTotalWeek /7).toFixed(2);
        
        gasTotalWeek = (weeklyAmount * gasWeight).toFixed(2);
        gasTotalDaily = (gasTotalWeek /7).toFixed(2);
    }
    
    //http://stackoverflow.com/questions/41207991/how-to-find-number-of-weeks-in-a-month-using-javascript
    function calcNumOfWeeks(){
        
        //is always a month behind, need to add 1 to get current month
        var currentMonth =  monthNum+1;
        
        //test code
        var firstOfMonth = new Date(year, currentMonth-1, 1);
        console.log("first: "+ firstOfMonth);
        var lastOfMonth = new Date(year, currentMonth, 0);
        console.log("last: "+ lastOfMonth);
        
        var used = firstOfMonth.getDay() + lastOfMonth.getDate();

        totalWeeks = Math.ceil( used / 7);
    }
    
    //creates a new label when user adds one
    function addLabel(label, labels){
       var i;
       if(label != ""){
           var repeat = false;
           for(i = 0; i < labels.length; i++){
               if(labels[i].text == label){

               repeat = true;
               i = labels.length;
               }
           }
           if(!repeat){
               labels.length += 1;
               labels[labels.length - 1].innerHTML += label;
               
               
               addHash(label);
           }
       }
   }
    
    function removeLabel(labels){
        if(labels.length > 1){
            var i;
            console.log(labels[labels.selectedIndex] + ", " + labels.length);
            for(i = labels.selectedIndex; i < labels.length; i++){
                if(i < labels.length - 1) {
                    labels[i].text = labels[i + 1].text;
                }
                else{
                    labels[i].text = "";
                    labels.length -= 1;
                }
            }
            
            removeHash(label);
            removeRange(index);
        }
    }
    
    // Adds a label to the labelArr and labelHash
    function addHash(label){
        if(label in labelArr){
            console.log("This label already exists within the labelArr");
        }
        else{
            labelArr[labelArr.length] = label;
            var repeat = false;
            for(var i = 0; i < labelHash.length; i++){
                if(labelHash.keys()[i] == label){
                    repeat = true;
                }
            }
            if(!repeat){
                labelHash[label] = .25;
            }
            else{
                labelHash.put(label, .25);
            }
            
               addRange(label);
            
        }
    }
    
    // Removes a label from the labelArr
    function removeHash(label){
        var index = labelArr.indexOf(label);
        if (index > -1) {
            labelArr.splice(index, 1);
        }
    }
    
 // Adds a range to the ranges
    function addRange(label){
        var ranges = document.querySelector('#ranges');
        var inner = "<span> <label for='";
        inner += label;
        inner += "Label'>";
        inner += label;
        inner += "</label></span>";
        inner += "<input type = 'range' id ='";
        inner += label;
        inner += "Range' value = 25>";
        inner += "<span class = 'percentage' id = '";
        inner += label;
        inner += "Expenses'>25%</span>";
        inner += "<br /><br />";
        
        allRanges[allRanges.length] = inner;
        ranges.innerHTML = "";
        
        console.log("LENGTH: " + labelArr.length);
        
        for(var i = 0; i < allRanges.length; i++){
            ranges.innerHTML += allRanges[i];
            hookupRange(labelArr[i], i);
        }
        //hookupRange(label, labelArr.length - 1);
        allWeights.length += 1;
    }
    
    // Removes a range from the ranges
    function removeRange(index){
        allRanges.splice(index, 1);
    }
    
    // Hooks up the ranges so when they change their values will be recorded
    function hookupRange(label, index){
        
        document.querySelector('#' + label + 'Range').onchange = function(e){
            document.querySelector('#' + label + 'Expenses').innerHTML = e.target.value + '%';
            allWeights[index] = e.target.value / 100;
            console.log(labelArr[index] + ": " + allWeights[index]);
        };
        console.log("WUT");
    }
    
    window.addEventListener("load",init);
})();