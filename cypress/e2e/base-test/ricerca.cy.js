describe('Simple Weather App Search', () => {
    it('Test Weather API', () => {
        //     data fetch from API and check the response status
        cy.request('GET', 'https://api.openweathermap.org/data/2.5/weather?lat=45.0677551&lon=7.6824892&lang=it&units=metric&appid=b728e5ed8db5ad5e2c822246726d67aa')
        .then((response) => {
            // check the response is equal to an object with main property
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('main')
        })
    })

    it('Test Weather API with wrong coordinates', () => {
        //     data fetch from API and check the response status
        cy.request({
            url: 'https://api.openweathermap.org/data/2.5/weather?lat=999&lon=999&lang=it&units=metric&appid=b728e5ed8db5ad5e2c822246726d67aa',
            failOnStatusCode: false
        })
        .then((response) => {
            // check the response is equal to an object with main property
            expect(response.status).to.eq(400)
            expect(response.body).to.have.property('message')
        })

    })

    it('Search for Torino', () => {
        cy.viewport(1440, 900)
        cy.visit('http://localhost:3000/')

        cy.get('.search-form input').clear().type('Torino')
        cy.get('.search-form').then(($form) => {
            $form.on('submit', e => {
                e.preventDefault();

            });
        });
        cy.get('.search-form button').click()
        cy.wait(1000)
        cy.get('h1').should('contain', 'Torino')

    })
})
