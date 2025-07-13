// Animation for the estimate button
document.getElementById('estimateBtn').addEventListener('click', function() {
    onClickedEstimatePrice();
});

function getBathValue() {
    var uiBathrooms = document.getElementsByName("uiBathrooms");
    for (var i = 0; i < uiBathrooms.length; i++) {
        if (uiBathrooms[i].checked) {
            return parseInt(uiBathrooms[i].value);
        }
    }
    return -1;
}

function getBHKValue() {
    var uiBHK = document.getElementsByName("uiBHK");
    for (var i = 0; i < uiBHK.length; i++) {
        if (uiBHK[i].checked) {
            return parseInt(uiBHK[i].value);
        }
    }
    return -1;
}

function onClickedEstimatePrice() {
    var sqft = document.getElementById("uiSqft");
    var bhk = getBHKValue();
    var bathrooms = getBathValue();
    var location = document.getElementById("uiLocations");
    var estPrice = document.getElementById("uiEstimatedPrice");
    
    // Show loading animation
    estPrice.innerHTML = `
        <div class="price-label">CALCULATING PRICE</div>
        <div class="loading-dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
    `;

    var url = "http://127.0.0.1:5000/predict_home_price";

    $.post(url, {
        total_sqft: parseFloat(sqft.value),
        bhk: bhk,
        bath: bathrooms,
        location: location.value
    }, function (data, status) {
        if (data && data.estimated_price) {
            // Format price with commas
            const formattedPrice = new Intl.NumberFormat('en-IN').format(data.estimated_price.toFixed(2));
            
            // Animation for price display
            estPrice.innerHTML = `
                <div class="price-label">YOUR ESTIMATED PRICE</div>
                <div class="price-display">₹${formattedPrice}</div>
                <div class="price-label">Lakh Rupees</div>
            `;
            
            // Add animation effect
            const priceDisplay = document.querySelector('.price-display');
            priceDisplay.style.opacity = 0;
            priceDisplay.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                priceDisplay.style.transition = 'all 0.8s ease-out';
                priceDisplay.style.opacity = 1;
                priceDisplay.style.transform = 'translateY(0)';
            }, 50);
        } else {
            estPrice.innerHTML = `
                <div class="price-label" style="color:#ff6b6b;">ERROR</div>
                <div class="price-display" style="font-size:1.5rem;">Could not fetch price</div>
            `;
        }
    }).fail(function() {
        estPrice.innerHTML = `
            <div class="price-label" style="color:#ff6b6b;">CONNECTION ERROR</div>
            <div class="price-display" style="font-size:1.5rem;">Server not responding</div>
        `;
    });
}

function onPageLoad() {
    var url = "http://127.0.0.1:5000/get_location_names";
    
    // Show loading state in dropdown
    const locationSelect = document.getElementById("uiLocations");
    locationSelect.innerHTML = '<option disabled selected>Loading locations...</option>';

    $.get(url, function (data, status) {
        if (data && data.locations) {
            var locations = data.locations;
            locationSelect.innerHTML = '';
            
            // Add default option
            var defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Select a location";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            locationSelect.appendChild(defaultOption);
            
            // Add locations
            for (var i = 0; i < locations.length; i++) {
                var opt = document.createElement("option");
                opt.value = locations[i];
                opt.textContent = locations[i];
                locationSelect.appendChild(opt);
            }
        }
    }).fail(function() {
        locationSelect.innerHTML = '<option disabled selected>Failed to load locations</option>';
    });
}

window.onload = onPageLoad;

// Add floating effect to container
const container = document.querySelector('.container');
window.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    container.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});