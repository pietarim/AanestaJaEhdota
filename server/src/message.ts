const Vonage = require('@vonage/server-sdk')
require('dotenv').config({ path: "./src/.env" })
import { VERSIO } from "./config"

const urlViestiin = VERSIO === "kehitys" ? process.env.clientUrlTest : process.env.URL

export function ViestiFormatointi(tapahtuma: any) {
  let viesti = `Tapahtuma ${tapahtuma.otsikko} luotu. Osallistujien tunnukset:
`
  let msmOsallistujalle = ""
  tapahtuma.osallistujat.forEach(osallistuja => {
    msmOsallistujalle += `Tunnus: ${osallistuja.nimi} kirjautuminen: ${urlViestiin}/?k=${osallistuja.salasana}&t=${tapahtuma.salasana}
`
  })
  viesti += msmOsallistujalle
  console.log(msmOsallistujalle)
  return viesti
}

export function LuoMsm(tapahtuma, numero) {
  let viesti = `Tapahtuma ${tapahtuma.otsikko} luotu. Osallistujien tunnukset:
`
  let msmOsallistujalle = ""
  tapahtuma.osallistujat.forEach(osallistuja => {
    msmOsallistujalle += `Tunnus: ${osallistuja.nimi} kirjautuminen: ${urlViestiin}/?k=${osallistuja.salasana}&t=${tapahtuma.salasana}
`
  })
  viesti += msmOsallistujalle

  return viesti
}
