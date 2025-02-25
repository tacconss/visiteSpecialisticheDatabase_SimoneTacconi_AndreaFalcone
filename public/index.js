import {createMiddleware} from "./createMiddleware/createMiddleware.js";
import {generateReservationForm} from "./formComponent/formComponent.js";
import {generateNavbar} from "./navbarComponent/navbarComponent.js";
import {generateButtonComponent} from "./buttonComponent/buttonComponent.js";
import {generateTable} from "./tableComponent/tableComponent.js";

const modalBody = document.getElementById("modalBody");
const navbarContainer = document.getElementById("navbarContainer");
const tableContainer = document.getElementById("tableContainer");
const prevButtonContainer = document.getElementById("prevButtonContainer");
const nextButtonContainer = document.getElementById("nextButtonContainer");
const spinner = document.getElementById("spinner");

let confFileContent;
const hours = [8, 9, 10, 11, 12];
const days = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì"];

const middleware = createMiddleware() ;
const componentTable = generateTable(tableContainer);
const reservationForm = generateReservationForm(modalBody);
const navbar = generateNavbar(navbarContainer);
const prevButton = generateButtonComponent(prevButtonContainer) ;
const nextButton = generateButtonComponent(nextButtonContainer) ;

fetch("./conf.json")
.then(r => r.json())
.then(async (data) => {
    confFileContent = data;

    navbar.build(confFileContent["tipologie"]);
    navbar.render();

    navbar.onclick(async (category) => {
        reservationForm.setType(category);
        spinner.classList.remove("d-none");
        console.log(await middleware.getData())
        componentTable.setData(await middleware.getData(),category)
        componentTable.render();
        spinner.classList.add("d-none");
    });
    reservationForm.setType(navbar.getCurrentCategory());
    
    componentTable.build(hours, days);
    spinner.classList.remove("d-none");
    
    spinner.classList.add("d-none");
    componentTable.setData(data, navbar.getCurrentCategory());
    componentTable.render();

    reservationForm.build(hours);
    reservationForm.render();
    reservationForm.onsubmit(async (r) => {
        console.log(r)
        if (componentTable.add(r)) {
            console.log(componentTable.getData())
            reservationForm.setStatus(true);
            componentTable.setData(componentTable.getData(), navbar.getCurrentCategory());
            await middleware.setData(componentTable.getData());
        }
        else {
            reservationForm.setStatus(false);
        }
    });
    reservationForm.oncancel(() => componentTable.render());

    prevButton.build('Settimana precedente') ;
    nextButton.build('Settimana\nsuccessiva') ;

    prevButton.render() ;
    prevButton.onsubmit(() => {
        componentTable.previous();
        componentTable.setData(componentTable.getData(), navbar.getCurrentCategory());  
        componentTable.render();
    }) ;

    nextButton.render() ;
    nextButton.onsubmit(() => {
        componentTable.next();
        componentTable.setData(componentTable.getData(), navbar.getCurrentCategory());  
        componentTable.render();
    }) ;

    reservationForm.setType(navbar.getCurrentCategory());
    spinner.classList.remove("d-none");
    spinner.classList.add("d-none");
    componentTable.setData(await middleware.getData() ,navbar.getCurrentCategory())
    componentTable.render();

    setInterval(async () => {
        reservationForm.setType(navbar.getCurrentCategory());
        spinner.classList.remove("d-none");
        spinner.classList.add("d-none");
        componentTable.setData(await middleware.getData() ,navbar.getCurrentCategory())
        componentTable.render();
    }, 300000);
});