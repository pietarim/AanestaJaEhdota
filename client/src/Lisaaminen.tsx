import { useState } from 'react'
import Card from '@mui/material/Card'
import Alert from '@mui/material/Alert'
import { produce } from "immer"
import MuiAlert from '@material-ui/lab/Alert'
import { useMutation } from "@apollo/client"
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Button from '@material-ui/core/Button'
import { LUOMINEN } from "./graphOperations"
import { borderRadius } from '@mui/system'
import CloseIcon from '@mui/icons-material/Close'
import './App.css'

const Lisaaminen = () => {

  const [osallistujat, setOsallistujat] = useState(["", "", "", "", ""])
  const [otsikko, setOtsikko] = useState("")
  const [vaiheet, setVaiheet] = useState(["", "", "", "", ""])
  const [numero, setNumero] = useState("")
  const [naytaInfo, setNaytaInfo] = useState(false)

  const Lisaaminen = async () => {
    const tallennettu = await muokkaa()
  }

  const [muokkaa, { data, loading, error }] = useMutation<
    { lisaaTapahtuma: string },
    { otsikko: string, numero: string, vaiheet: string[], osallistujat: string[] }
  >(LUOMINEN, { variables: { otsikko, numero, vaiheet, osallistujat } })

  const PoistaRivi = () => {
    if (osallistujat.length > 5) {
      return (
        <Button onClick={() => rivinPoistaminen()} >Poista rivi</Button>
      )
    } else {
      return null
    }
  }

  const PoistaVaiRivi = () => {
    if (vaiheet.length > 5) {
      return (
        <Button onClick={() => vaiheRiviPoistaminen()} >Poista rivi</Button>
      )
    } else {
      return null
    }
  }

  function rivinPoistaminen() {
    const index = osallistujat.length - 1
    let textFieldArr: Array<string> = []
    for (let i = 0; i < index; i++) {
      textFieldArr = [...textFieldArr, osallistujat[i]]
    }
    setOsallistujat(textFieldArr)
  }

  function vaiheRiviPoistaminen() {
    const index = vaiheet.length - 1
    let textFieldArr: Array<string> = []
    for (let i = 0; i < index; i++) {
      textFieldArr = [...textFieldArr, vaiheet[i]]
    }
    setVaiheet(textFieldArr)
  }

  /* async function kopiointi() {
    const teksti = document.getElementById("teksti").innerHTML;
    await navigator.clipboard.writeText(teksti);
  } */

  const Lisattava = () => {

    return (
      <div
        style={{
          position: "absolute", width: "100%"
        }}
      >
        <div className="lisays"
          /* style={{
            height: "100px",
            maxWidth: "600px",
            backgroundColor: "lightGrey",
            position: "relative",
            margin: "33% auto",
            top: "33%",
            margin: "50px auto",
            marginLeft: "50%",
            transform: "translateX(-50%)",
            zIndex: 200,
            borderRadius: "4px",
            boxShadow: "0 0 10px 10px",
            padding: "8px",
          }} */>
          <CloseIcon onClick={() => setNaytaInfo(false)} className="sulje" style={{ position: "absolute", right: "12px" }} />
          <h3>Tapahtuma lisätty "{ }"</h3>
          <p id="teksti">
            Tapahtuma aaaa luotu. Osallistujien tunnukset: Tunnus: aaaas kirjautuminen: https://aanestajaehdota.com/?k=G88Ck6Ng&t=jc8oAtNp Tunnus: dafds kirjautuminen: https://aanestajaehdota.com/?k=fJH2zLep&t=jc8oAtNp Tunnus: asdsdf kirjautuminen: https://aanestajaehdota.com/?k=hA3JvJcT&t=jc8oAtNp
          </p>
          <p>Olen tallentanut tapahtuman tiedot</p>
          <Button>Poista välimuistista</Button>
          <Button>Kopioi tiedot</Button>
        </div>
      </div >
    )
  }

  const Palaute = () => {
    if (data) {
      console.log(data.lisaaTapahtuma)
      return (
        /* <Container style={{ position: "absolute" }} component="main" maxWidth="sm" sx={{ mb: 4 }}> */
        <div style={{ position: "absolute", width: "100%" }}>
          <div style={{ maxWidth: "600px", margin: "300px auto" }}>

            <Alert
              elevation={6}
              variant="filled"
              severity="success"
            >
              {data.lisaaTapahtuma}
            </Alert>
          </div>
        </div>
        /* </Container> */
      )
    }
    if (loading) {
      return (
        <p>lataa...</p>
      )
    }
    if (error) {
      return (
        <p>joku meni pieleen</p>
      )
    }
    return (
      null
    )
  }

  return (
    <>
      {/* <div
        style={{
          height: "100px",
          width: "100px",
          backgroundColor: "green",
          position: "absolute",
          top: "60%",
          marginLeft: "45%",
          zIndex: 20,
          borderRadius: "4px"
        }}>
        Tapahtuma aaaa luotu. Osallistujien tunnukset: Tunnus: aaaas kirjautuminen: https://aanestajaehdota.com/?k=G88Ck6Ng&t=jc8oAtNp Tunnus: dafds kirjautuminen: https://aanestajaehdota.com/?k=fJH2zLep&t=jc8oAtNp Tunnus: asdsdf kirjautuminen: https://aanestajaehdota.com/?k=hA3JvJcT&t=jc8oAtNp
      </div> */}
      {naytaInfo ? <Lisattava /> : null}
      <Palaute />
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <h1 style={{ marginTop: "0", padding: "16px", fontSize: "56px", color: "#fafafa" }}>Luo tapahtuma</h1>
        <Paper variant="outlined" sx={{ p: { xs: 3, md: 6 }, mx: { xs: 0.5 }, mb: 2 }} style={{ bottom: "10px" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tapahtuman nimi"
                value={otsikko}
                onChange={(e) => {
                  setOtsikko(e.target.value)
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Puhelin (mudossa 3581111111)"
                value={numero}
                onChange={(e) => {
                  setNumero(e.target.value)
                }}
              />
            </Grid>
          </Grid>
          <h2>Osallistujat</h2>
          <Grid container spacing={3}>
            {osallistujat.map((n, i) => {
              return (
                <Grid key={i} item xs={12} sm={6}>
                  <TextField
                    label="osallistuja"
                    value={n}
                    fullWidth
                    onChange={(e) => {
                      let jono = osallistujat
                      let value = e.target.value
                      jono[i] = value
                      setOsallistujat([...jono])
                    }}
                  />
                </Grid>
              )
            })}
            <Button style={{ paddingLeft: "24px" }} onClick={() => {
              setOsallistujat([...osallistujat, ""])
            }}>
              Lisaa rivi
            </Button>
            <PoistaRivi />
          </Grid>
          <h2>Vaiheet</h2>
          <Grid container spacing={3}>
            {vaiheet.map((n, i) => {
              return (
                <Grid key={i} item xs={12} sm={6}>
                  <TextField
                    label={`Vaihe ${i + 1}`}
                    value={n}
                    fullWidth
                    onChange={(e) => {
                      let jono = vaiheet
                      let value = e.target.value
                      jono[i] = value
                      setVaiheet([...jono])
                    }}
                  />
                </Grid>
              )
            })}
            <Button style={{ paddingLeft: "24px" }} onClick={() => {
              setVaiheet([...vaiheet, ""])
            }}>
              Lisaa rivi
            </Button>
            <PoistaVaiRivi />
          </Grid>
          <Button style={{ marginTop: "32px" }} variant="contained" onClick={Lisaaminen}>luo tapahtuma</Button>
        </Paper>
        <div style={{ margin: "2px", opacity: "0" }}>a</div>
      </Container>
      <Button onClick={() => setNaytaInfo(true)}>Info esille</Button>
    </>
  )
}

export default Lisaaminen