// country name and its currency code
let country_details;
async function fetchCountryInfo() {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const countries = await response.json();
  
      const countryInfo = {};
  
      countries.forEach(country => {
        const name = country.name.common;
        const currency = country.currencies ? Object.keys(country.currencies)[0] : 'N/A';
        const countryCode = country.cca2 || 'N/A';
  
        countryInfo[name] = {
          currency: currency,
          countryCode: countryCode
        };
      });
  
      return countryInfo;
    } catch (error) {
      console.error('Error fetching country information:', error);
      return null;
    }
  }
  
  fetchCountryInfo().then(countryInfo => {
    country_details=countryInfo
    makeoption(Object.keys(countryInfo))
  });




// ----------------making availabe of all country name in select tag----------------------------------
function makeoption(country_names){
    let from_country_option=document.querySelector("#from")
    let to_country_option=document.querySelector("#to")

    for(country of country_names.sort()){
        from_country_option.innerHTML+=`<option value=${country}>${country}</option>`
        to_country_option.innerHTML+=`<option value=${country}>${country}</option>`
    }
    getResponse()

}
// -------------------------- getting user input------------------------------------------
function getResponse(){
  document.querySelector(".convert-btn").addEventListener("click",()=>{
      document.querySelector(".all-details-container").innerHTML=""
      let from=document.querySelector(".from")
      let to=document.querySelector(".to")
      let amt=document.querySelector(".amt").value
      
      // fetching data
      const api_key="748805839d55f74fa0d8d6ea"
      fetch(`https://v6.exchangerate-api.com/v6/${api_key}/latest/${country_details[country].currency}`)
      .then(res=>res.json())
      .then((data)=>{
        let from_country_currency=country_details[from.value].currency
        let to_country_currency=country_details[to.value].currency
        displayAllcountry(data["conversion_rates"],from_country_currency,to_country_currency)
        displayMain(data["conversion_rates"],amt,from_country_currency,to_country_currency)
      })
  })
}

// main display
function displayMain(data,amt,from,to){
  amt=amt==""?1:parseInt(amt)
  let from_val=amt
  let to_val=(amt*data[to]).toFixed(2)
  if(from==to){
    to_val=from_val
  }
  document.querySelector(".output-container").innerHTML=
  `
  <h1 class="output">${amt+" "+from.toLowerCase()+" "+" = "+" "+to_val+" "+to.toLowerCase()}</h1>
  `
}




// all country display
function displayAllcountry(data_list,from,to){


  let container=document.querySelector(".all-details-container")
  
  for(country in country_details){
    let val=data_list[country_details[country]["currency"]]
    let country_code=country_details[country]["countryCode"]
    let def="IN"
    let flag_img=`https://flagsapi.com/${country_code}`
    
      let elem=
      `
      <div class="col-sm-4 col-md-6 col-lg-2">
        <div class="detail">
                <img src="https://flagsapi.com/${flag_img}/flat/64.png" alt="${country}">
                <p>${country.toUpperCase()}</p>
                <p>1${" "+from}</p>
                <p>=</p> 
                <p>${data_list[country_details[country]["currency"]]!=undefined?data_list[country_details[country]["currency"]]:"NA"}${" "+country_details[country]["currency"]}</p>
          </div>
      </div>
      `
      container.innerHTML+=elem
    
      
  }
}


  
// interchange the exchange option

document.querySelector(".exchange-btn").addEventListener("click",()=>{
  let from=document.querySelector(".from")
  let to=document.querySelector(".to")
  let from_cur_value=from.value
  let to_cur_value=to.value
  from.value=to_cur_value
  to.value=from_cur_value

})