(async () => {
    // Set dom
    let dataDom = document.getElementById('data');
    let employeeSearch = document.getElementById('employeeSearch');
    let companySearch = document.getElementById('companySearch');

    // set constants
    let employees;
    let companies;
    let search = '';
    let compSearch = '';

    const fetchEmployees = async () => {
        let res = await fetch('../assets/data/employee_data.json', {
            headers: {
                'Content-Type':'application/json'
            }
        });

        return res.json();
    }

    const fetchCompanies = async () => {
        let res = await fetch('../assets/data/company_data.json', {
            headers: {
                'Content-Type':'application/json'
            }
        });

        return res.json();
    }

    const showEmployees = async () => {
        dataDom.innerHTML = '';

        // First we sort, because sorted data is happy data, then we filter based on search criteria, then we iterate through and build the dom.
        employees
            .sort((a, b) => {
                return a.last_name.toLowerCase().localeCompare(b.last_name.toLowerCase());
            })
            .filter((emp) => emp.last_name.toLowerCase().includes(search.toLowerCase()))
            .forEach((emp, index) => {
                let comp = companies.filter((item) => typeof item.id !== undefined && item.id === emp.company_id);
                let empObject = ` <div class="col-md-4">
                                        <div class="p-4 border bg-light border-3">
                                            <div class="row d-flex justify-content-between">
                                                <div class="col-4 avatar">
                                                    <img src="${emp.avatar}" alt="">
                                                </div>
                                                <div class="col-8">
                                                    <p style="margin: 0; font-size: 1em">${emp.last_name}, ${emp.first_name}</p>
                                                    <p >${emp.email}</p>
                                                </div>
                                            </div>
                                            <div class="card-body">
                                                <a href="#" style="font-size: 1.2em; font-weight: 300; text-decoration: none">${comp[0].company_name}</a>
                                            </div>
                                        </div>
                                    </div>
                                `;
                // Append it to the Dom.
                dataDom.innerHTML += empObject

            });
    }

    try{
        employees = await fetchEmployees();
        companies = await fetchCompanies();

        companies.sort((a, b) => { return a.company_name.toLowerCase().localeCompare(b.company_name.toLowerCase()); }).forEach((comp, index) => {
            let option = `
                <option value="${comp.id}">${comp.company_name}</option>
            `;

            companySearch.innerHTML += option;
        })

        if(employees && companies){
            await showEmployees();

            employeeSearch.addEventListener('input', (e) => {
                // Search Term
                search = e.target.value;
                showEmployees()
            });

            companySearch.addEventListener('change', (e) => {
                compSearch = e.target.value;
                showEmployees()
            })

        } else {
            // Throw an error if things are sideways.
            throw new Error('There was an issue getting employees or companies.');
        }
    } catch(err) {
        // Display the error.
        console.error(err.message);
    }
})()




