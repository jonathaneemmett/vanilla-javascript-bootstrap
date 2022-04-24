;(async () => {
	// Set dom
	let dataDom = document.getElementById('data')
	let employeeSearch = document.getElementById('employeeSearch')
	let companySearch = document.getElementById('companySearch')
	let showModal = document.getElementById('showModal')
	let clear = document.getElementById('clearSearch')

	// Modal Form
	let myModal = new bootstrap.Modal(document.getElementById('modal'))
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

	const filterByCompany = async (id) => {
		if (id) {
			employees = employees.filter((emp) => emp.company_id === Number(id))
			await showEmployees()
		} else {
			await clearSearch()
		}
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

				let empObject = `<div class="col-md-4 col-lg-4">
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
														<a class="btn text-primary fs-5 company"  data-comp-id="${comp[0].id}">${comp[0].company_name}</a>
													</div>
												</div>
                                            </div>
                                        </div>
                                    </div>
								`
				// Append it to the Dom.
				dataDom.innerHTML += empObject
			})

		// Handle a link click from emp template literal
		let compLink = document.querySelectorAll('.company')
		for (let i = 0; i < compLink.length; i++) {
			compLink[i].addEventListener('click', async () => {
				await filterByCompany(compLink[i].dataset.compId)
			})
		}
	}

	// Utility Functions
	const clearForm = () => {
		firstName.value = ''
		lastName.value = ''
		email.value = ''
		companyName.value = ''
		search = ''
	}

	const clearSearch = async () => {
		employeeSearch.value = ''
		companySearch.selectedIndex = 0
		search = ''

		employees = await fetchEmployees()
		companies = await fetchCompanies()
		await showEmployees()
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

			employeeSearch.addEventListener('input', async (e) => {
				// Search Term
				search = e.target.value
				await showEmployees()
			})

			companySearch.addEventListener('change', async (e) => {
				await filterByCompany(e.target.value)
			})

			// Modal Functions
			showModal.addEventListener('click', () => {
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
					// Little bit of validation
					if (
						!firstName.value ||
						!lastName.value ||
						!email.value ||
						!companyName.value
					) {
						// Throw an error if a field is empty, would put this in some sort of function that handled displaying to the user which field.
						throw new Error('All form fields are required.')
					}

					// Mock submit to db..
					console.log(
						`Last Name: ${lastName.value}, First Name: ${
							firstName.value
						}, Email: ${email.value} was added to Company: ${
							companyName.options[companyName.selectedIndex].text
						}`,
					)

					// Clear the form
					clearForm()
				} catch (err) {
					console.error(err.message)
				}

				// Hide the modal
				myModal.hide()
			})

			// Clear search
			clear.addEventListener('click', async () => {
				await clearSearch()
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
