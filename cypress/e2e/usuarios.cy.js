/// <reference types="cypress" />
import { faker } from '@faker-js/faker'
import contrato from '../contracts/usuarios.contrato'

describe('Testes da Funcionalidade Usuários', () => {

    let nome = faker.person.fullName()
    let email = faker.internet.email(nome)
    let senha = faker.internet.password()
    let admin = 'true'

    it('Deve validar contrato de usuários', () => {
        cy.request('usuarios').then(response => {
            return contrato.validateAsync(response.body)
        })
    })

    it('Deve listar usuários cadastrados', () => {
        cy.request({
            method: 'GET',
            url: 'usuarios'
        }).should(response => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('usuarios')
        })
    })

    it('Deve cadastrar um usuário com sucesso', () => {
        cy.cadastrarUsuario(nome, email, senha, admin).should(response => {
            expect(response.status).to.eq(201)
            expect(response.body.message).to.eq('Cadastro realizado com sucesso')
        })
    })

    it('Deve validar um usuário com email inválido', () => {
        cy.cadastrarUsuario(nome, 'fulano@qa.com', senha, admin).then(response => {
            expect(response.status).to.eq(400)
            expect(response.body.message).to.eq('Este email já está sendo usado')
        })
    })

    it('Deve editar um usuário previamente cadastrado', () => {
        let email = faker.internet.email(nome)
        cy.cadastrarUsuario(nome, email, senha, admin).then(response => {
            let id = response.body._id
            cy.request({
                method: 'PUT', 
                url: `usuarios/${id}`,
                body: 
                {
                    "nome": "Cassia Sottolano Matos",
                    "email": email,
                    "password": senha,
                    "administrador": admin
                }
            }).then(response => {
                expect(response.status).to.eq(200)
                expect(response.body.message).to.eq('Registro alterado com sucesso')
            })

        })
    })

    it('Deve deletar um usuário previamente cadastrado', () => {
        let email = faker.internet.email(nome)
        cy.cadastrarUsuario(nome, email, senha, admin).then(response => {
            let id = response.body._id
            cy.request({
                method: 'DELETE', 
                url: `usuarios/${id}`
            }).then(response => {
                expect(response.status).to.eq(200)
                expect(response.body.message).to.eq('Registro excluído com sucesso')
            })

        })
    })

})
