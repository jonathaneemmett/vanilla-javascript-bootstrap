;(async () => {
	// Set dom
	let dataDom = document.getElementById('data')
	let employeeSearch = document.getElementById('employeeSearch')
	let companySearch = document.getElementById('companySearch')
	let showModal = document.getElementById('showModal')

	// Modal Form
	let modalClose = document.getElementById('modal_close')
	let firstName = document.getElementById('first_name')
	let lastName = document.getElementById('last_name')
	let email = document.getElementById('email')
	let companyName = document.getElementById('company_name')
	let displayCompany = document.getElementById('displayCompany')
	let addEmployee = document.getElementById('add_employee')

	// set constants
	let employees
	let companies
	let search = ''
	let compSearch = ''

	const fetchEmployees = async () => {
		let res = await fetch('../assets/data/employee_data.json', {
			headers: {
				'Content-Type': 'application/json',
			},
		})

		return res.json()
	}

	const fetchCompanies = async () => {
		let res = await fetch('../assets/data/company_data.json', {
			headers: {
				'Content-Type': 'application/json',
			},
		})

		return res.json()
	}

	const showEmployees = async () => {
		dataDom.innerHTML = ''

		// First we sort, because sorted data is happy data, then we filter based on search criteria, then we iterate through and build the dom.
		employees
			.sort((a, b) => {
				return a.last_name
					.toLowerCase()
					.localeCompare(b.last_name.toLowerCase())
			})
			.filter((emp) =>
				emp.last_name.toLowerCase().includes(search.toLowerCase()),
			)
			.forEach((emp, index) => {
				let comp = companies.filter(
					(item) => typeof item.id !== undefined && item.id === emp.company_id,
				)
				let empObject = `   <div class="col-md-4 col-lg-4">
                                        <div class="card border-3 bg-light h-100">
                                            <div class="card-body py-4">
                                                <div class="row ms-1">
                                                    <div class="col-4 col-md-4 col-lg-3">
                                                        <img src="${emp.avatar}" alt="emp-avatar" class="img-sm-fluid">
                                                    </div>
                                                    <div class="col-8 col-lg-9">
                                                        <p class="text-muted fs-5">${emp.last_name}, ${emp.first_name}</p>
                                                        <p class="text-muted fs-6">${emp.email}</p>
                                                    </div>                                                    
                                                </div>
                                                <div class="row my-4 ms-2">
                                                    <div class="col">
                                                    <a href="#" style="font-size: 1.2em; font-weight: 300; text-decoration: none">${comp[0].company_name}</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `
				// Append it to the Dom.
				dataDom.innerHTML += empObject
			})
	}

	// Utility Functions
	const clearForm = () => {
		firstName.value = ''
		lastName.value = ''
		email.value = ''
		companyName.value = ''
	}

	try {
		employees = await fetchEmployees()
		companies = await fetchCompanies()

		companies
			.sort((a, b) => {
				return a.company_name
					.toLowerCase()
					.localeCompare(b.company_name.toLowerCase())
			})
			.forEach((comp, index) => {
				let option = `
                <option value="${comp.id}">${comp.company_name}</option>
            `

				companySearch.innerHTML += option
				companyName.innerHTML += option
			})

		if (employees && companies) {
			await showEmployees()

			employeeSearch.addEventListener('input', (e) => {
				// Search Term
				search = e.target.value
				showEmployees()
			})

			companySearch.addEventListener('change', (e) => {
				compSearch = e.target.value
				showEmployees()
			})

			// Show modal
			showModal.addEventListener('click', () => {
				var myModal = new bootstrap.Modal(document.getElementById('modal'))
				myModal.show()
			})

			companyName.addEventListener('change', (e) => {
				let newHtml = `Add employee to ${
					companyName.options[companyName.selectedIndex].text
				}`
				displayCompany.innerHTML = newHtml
			})

			modalClose.addEventListener('click', () => {
				clearForm()
			})

			addEmployee.addEventListener('click', () => {
				try {
					if (
						!firstName.value ||
						!lastName.value ||
						!email.value ||
						!companyName.value
					) {
						throw new Error('All form fields are required.')
					}

					console.log(
						`Last Name: ${lastName.value}, First Name: ${
							firstName.value
						}, Email: ${email.value} was added to Company: ${
							companyName.options[companyName.selectedIndex].text
						}`,
					)

					clearForm()
				} catch (err) {
					console.error(err.message)
				}
			})
		} else {
			// Throw an error if things are sideways.
			throw new Error('There was an issue getting employees or companies.')
		}
	} catch (err) {
		// Display the error.
		console.error(err.message)
	}
})()
