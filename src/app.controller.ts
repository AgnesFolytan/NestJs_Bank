import { Controller, Get, Param, Res, Post, Query, Render, Body, HttpRedirectResponse, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { Account } from './Account';
import { OPenAccountDto } from './OpenAccount.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
    #accounts: Account[] = [
      {
      id: '1111-2222',
      balance: 15000,
      owner: 'Admin',
      createdAt: new Date(2020, 1, 1)
    },
    {
      id: '1234-5678',
      balance: 200000,
      owner: 'User12',
      createdAt: new Date(2021, 12, 1)
    },
    {
      id: '2233-4455',
      balance: 0,
      owner: 'New User 2',
      createdAt: new Date()
    }
    ]

    @Get()
    @Render('index')
    getHello(){
      return {
        message: this.appService.getHello()
      }
    }

    @Get('openAccount')
    @Render('openAccountForm')
    openAccountForm() {
      return {
        data : {},
        errors: []
      }
    }

    @Post('openACcount')
    openAccount(
      @Body() openAccountDto: OPenAccountDto,
      @Res() response: Response
      ){
        let errors = [];


        if(!openAccountDto.id || !openAccountDto.balance || !openAccountDto.owner){
          errors.push("Minden mezőt kötelező kitölteni!");
        }
        if(! /\d\d\d\d-\d\d\d\d$/.test(openAccountDto.id)){
          errors.push("A számlaszám 0000-0000 formátum legyen")
        } else {
          const acc = this.#accounts.find(acc => acc.id == openAccountDto.id);
          if (acc != undefined){
            errors.push("A számlaszám már létezik")
          }
        }
        let balance = parseInt(openAccountDto.balance);
        if (balance < 0 ) {
          errors.push('Az egyenleg nem lehet negatív');
        }

        if (errors.length > 0) {
          response.render('OpenAccountForm', {
            data: openAccountDto,
            errors
          })
          return;
        }

      const newAccount: Account = {
          id: openAccountDto.id,
          owner: openAccountDto.owner,
          balance: parseInt(openAccountDto.balance),
          createdAt: new Date(),
      }
      
      this.#accounts.push(newAccount);
      response.redirect('/OpenAccountSuccess');
    }

    @Get('OpenAccountSuccess')
    OpenAccountSuccess(){
      return "Sikeres művelet"
    }
  }