$(document).ready(function () {

	// Search Value & Click Button From FontAwesome
	$("#search-button").on("click", function () {
    event.preventDefault();
    var searchValue = $("#search-value").val();
    $("#search-value").val("");
    // Clear Boxes After Submission
	$("input:text").click(function () {
		$(this).val("");
		$("#today").empty();
        $("#forecast").empty();
	});
	searchWeather(searchValue);

});

	

	// Searcn History
	$(".history").on("click", "li", function () {
		searchWeather($(this).text());

	});

	// Search History LI Creation
	function makeRow(text) {
	
    var li = $("<li>")
			.addClass("list-group-item list-group-item-action")
			.text(text);
		$(".history").append(li);
	}



	// Set Measurement Units & Add 
	var metricUnits = "&units=metric";

	var openWeatherMap = "&appid=ac762fe30e04abc584e95fe72ccef3d8";

    
    function searchWeather(searchValue) {
	// Activate 'GET' Function with Outside API
	$.ajax({
		type: "GET",
		url:
			"https://api.openweathermap.org/data/2.5/weather?q=" +
			searchValue +
			metricUnits +
			openWeatherMap,
		dataType: "json",
		success: function (data) {
		
	// Save Previous Searches In Local Storage
		if (history.indexOf(searchValue) === -1) {
			history.push(searchValue);
			window.localStorage.setItem("history", JSON.stringify(history));
			
			makeRow(searchValue);
		}
		$("#today").empty();
		$("#forecast").empty();

	// Time & Date Conversions

	var sec = data.dt;
	var forecastdate = new Date(sec * 1000);
	var timestr = forecastdate.toLocaleTimeString();
	var datestr = forecastdate.toLocaleDateString();
	var daystr = forecastdate.getUTCDay();
	var weekday = new Array(7);
		weekday[0] = "Sunday";
		weekday[1] = "Monday";
		weekday[2] = "Tuesday";
		weekday[3] = "Wednesday";
		weekday[4] = "Thursday";
		weekday[5] = "Friday";
		weekday[6] = "Saturday";
	

	// HTML Assignment Based on API Content
	var forecastUl = $("<div>", { id: "forecast-container" });
    var liName = $("<div>", { id: "name-div" });
				liName.text(data.name + " (" + datestr + ") ");

	var liImg = $("<div>", { id: "img-div" });
	// Icon Assignment
	var iconImg = $("<img>");
		iconImg.attr(
			"src",
			"https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png",
		);
		liImg.append(iconImg);

	var liTemp = $("<div>", { id: "temp-div" });
		liTemp.text("Temperature: " + data.main.temp + " °C");

	var liHumidity = $("<div>", { id: "humid-div" });
		liHumidity.text("Humidity: " + data.main.humidity + "%");

	var liWindSpeed = $("<div>", { id: "speed-div" });
		liWindSpeed.text("Wind Speed: " + data.wind.speed + " KPH");

	var liUVIndex = $("<div>", { id: "index-div" });

		forecastUl.append(
			liName,
			liImg,
			liTemp,
			liHumidity,
			liWindSpeed,
			liUVIndex,
        );
        
		$("#today").append(forecastUl);
		getForecast(searchValue);
	    getUVIndex(data.coord.lat, data.coord.lon);
	
		},
});
}

	// Call 5 Day Forecast

	function getForecast(searchValue) {
	
		$.ajax({
			type: "GET",
			url:
			"https://api.openweathermap.org/data/2.5/forecast?q=" +
			searchValue +
			metricUnits +
			openWeatherMap,
			dataType: "json",
			success: function (data) {
			$("#forecast").empty();

	// HTML Title and Div Container
	var fiveTitle = $("<div>", {
			id: "five-title",
		});
        fiveTitle.text("5-Day Forecast:");
        
	var fiveContent = $("<div>", {
			class: "card-container",
			id: "five-content",
		});

		
			
	// Start Forecase Based on Current Day
		for (var i = 0; i < data.list.length; i++) {
					
		if (data.list[i].dt_txt.indexOf("12:00:00") !== -1) {
	var fiveCard = $("<div>", {
				class: "card",
				id: "five-card",
			});
				
	var fivesec = data.list[i].dt;
	var fiveforecastdate = new Date(fivesec * 1000);
	var fivedatestr = fiveforecastdate.toLocaleDateString();
    // Assign Current Day var = i=0 Current Day
    
    var fivedaystr = fiveforecastdate.getUTCDay();
	var fiveweekday = new Array(7);
			fiveweekday[0] = "Sunday";
			fiveweekday[1] = "Monday";
			fiveweekday[2] = "Tuesday";
			fiveweekday[3] = "Wednesday";
			fiveweekday[4] = "Thursday";
			fiveweekday[5] = "Friday";
			fiveweekday[6] = "Saturday";
    var fiveweekdaystr = fiveweekday[fivedaystr];
    
	var fiveDay = $("<h4>", {
				class: "card-title",
				id: "five-day",
			});
			fiveDay.text(fiveweekdaystr);
					

	var fiveDate = $("<h5>", {
				class: "card-title",
				id: "five-date",
			});
			fiveDate.text(fivedatestr);
					

	var fiveImg = $("<p>", {
				class: "card-body",
				id: "five-img",
			});
	var fiveIconImg = $("<img>");
			    fiveIconImg.attr(
				"src",
				"https://openweathermap.org/img/wn/" +
				data.list[i].weather[0].icon +
				"@2x.png",
			);
            fiveImg.append(fiveIconImg);
            
           
					

					
	var fiveTemp = $("<p>", {
			    class: "card-body",
			    id: "five-temp",
		});
		fiveTemp.text("Temperature: " + data.list[i].main.temp + " °C");
					
	var fiveHumidity = $("<p>", {
			class: "card-body",
			id: "five-humid",
			});
			fiveHumidity.text("Humidity: " + data.list[i].main.humidity + "%");
				
		fiveCard.append(
				fiveDay,
				fiveDate,
				fiveIconImg,
				fiveTemp,
				fiveHumidity,
						);

				$("#forecast .card-container").append(fiveCard);
				fiveContent.append(fiveCard);
                    }
				}
				$("#forecast").append(fiveTitle, fiveContent);
		},
		});
	}

	// UV Index 'GET' Call

	function getUVIndex(lat, lon) {
		$.ajax({
			type: "GET",
			url:
				"https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" +
				lat +
				"&lon=" +
				lon +
				openWeatherMap,
			dataType: "json",
			success: function (data) {
			
	var uv = data[0].value;
	var uvText = $("<p>").text("UV Index: ");
    var btn = $("<span>").addClass("btn btn-sm").text(data[0].value)
    
    // UV Index Colour Coding
			
		if (uv > 0 && uv <= 2.99) {
			btn.addClass("low-uv");
			btn.css("color", "black");
			btn.css("background-color", "lightblue");
		} else if (uv >= 3 && uv <= 5.99) {
			btn.addClass("moderate-uv");
			btn.css("color", "black");
			btn.css("background-color", "green");
		} else if (uv >= 6 && uv <= 7.99) {
			btn.addClass("high-uv");
			btn.css("color", "black");
			btn.css("background-color", "lightred");
		} else if (uv >= 8 && uv <= 20) {
			btn.addClass("vhigh-uv");
			btn.css("color", "white");
			btn.css("background-color", "darkred");
		        }

				$("#today #index-div").append(uvText.append(btn));
	        },
		});
	}

	var history = JSON.parse(window.localStorage.getItem("history")) || [];


	if (history.length > 0) {
		searchWeather(history[history.length - 1]);
	}


	for (var i = 0; i < history.length; i++) {
		makeRow(history[i]);
	}
});

$("#clear-button").on("click", function () {

	// Clear Storage
	localStorage.clear();
	window.location.reload();
});