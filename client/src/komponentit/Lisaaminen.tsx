import { useState, useEffect } from 'react'
import { useCopyToClipboard } from 'usehooks-ts'
import { useMutation } from "@apollo/client"
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Button from '@material-ui/core/Button'
import { LUOMINEN } from "../graphOperations"
import CloseIcon from '@mui/icons-material/Close'
import '../App.css'
import { naytettavaUrl } from '../config'

const Lisaaminen = () => {

  const [osallistujat, setOsallistujat] = useState(["", "", "", "", ""])
  const [otsikko, setOtsikko] = useState("")
  const [vaiheet, setVaiheet] = useState(["", "", "", "", ""])
  const [numero, setNumero] = useState("")
  const [naytaInfoMuistisssa, setNaytaInfoMuistisssa] = useState(false)
  const [infoMuistiArvo, setInfoMuistiArvo] = useState<Object | undefined>()
  const [naytaInfo, setNaytaInfo] = useState(false)

  useEffect(() => {
    const kirjInfo = localStorage.getItem("kirjInfo")
    if (kirjInfo) {
      setNaytaInfoMuistisssa(true)
      setInfoMuistiArvo(JSON.parse(kirjInfo))
    }
  }, [])

  const [muokkaa, { data, loading, error }] = useMutation<
    { lisaaTapahtuma: /* string */ TapahtumaInfo },
    { otsikko: string, numero: string, vaiheet: string[], osallistujat: string[] }
  >(LUOMINEN, { variables: { otsikko, numero, vaiheet, osallistujat } })

  interface TapahtumaInfo {
    otsikko: string,
    osallistujat: [Osallistujat],
    salasana: string,
  }

  type Props = any

  interface Osallistujat {
    nimi: string,
    salasana: string,
  }

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

  function poistaMuistista() {
    localStorage.removeItem("kirjInfo")
    setNaytaInfo(false)
    setNaytaInfoMuistisssa(false)
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

  function infoEsille() {
    setNaytaInfo(true)
    setNaytaInfoMuistisssa(true)
  }

  const Lisattava = ({ data }: Props) => {

    const [value, copy] = useCopyToClipboard()

    let teksti = ""

    data.osallistujat.forEach((e: any) => {
      teksti += `Käyttäjän ${e.nimi} tunnus: ${naytettavaUrl}/?k=${e.salasana}&t=${data.salasana}
`
    })

    function lisaaminen() {
      if (typeof (teksti) === "string") {
        copy(teksti)
      }
      else {
        console.log("kopioiminen epäonnistui")
      }
    }

    function piilotaInfo() {
      setNaytaInfo(false)
      setNaytaInfoMuistisssa(false)
    }

    if (data) {
      const kirjInfoString = JSON.stringify(data)
      localStorage.setItem("kirjInfo", kirjInfoString)

      return (
        <div
          style={{
            position: "absolute", width: "100%"
          }}
        >
          <div className="lisays">
            <CloseIcon
              onClick={() => piilotaInfo()}
              className="sulje"
              style={{ position: "absolute", right: "12px" }}
            />
            <h3>Tapahtuma: "<b>{data.otsikko}</b>" luotu</h3>
            <div id="teksti">
              {data.osallistujat.map((n: any, i: number) =>
                <p key={i}>
                  Käyttäjän {n.nimi} tunnus: {naytettavaUrl}/?k={n.salasana}&t={data.salasana}
                </p>)}
            </div>
            <p>Olen tallentanut tapahtuman tiedot</p>
            <Button onClick={() => poistaMuistista()}>Poista muistista</Button>
            <Button onClick={() => lisaaminen()}>Kopioi tiedot</Button>
          </div>
        </div >
      )
    } if (loading) {
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

  function tapahtumanLuominen() {
    setNaytaInfo(true)
    muokkaa()
  }

  return (
    <>
      {data && naytaInfo ? <Lisattava data={data.lisaaTapahtuma} /> : null}
      {loading ? <p>Ladataan...</p> : null}
      {error ? <p>joku meni pieleen</p> : null}
      {naytaInfoMuistisssa ? <Lisattava data={infoMuistiArvo} /> : null}
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <h1 style={{
          marginTop: "0",
          padding: "16px",
          fontSize: "56px",
          color: "#fafafa"
        }}>
          Luo tapahtuma
        </h1>
        <Paper variant="outlined"
          sx={{ p: { xs: 3, md: 6 }, mx: { xs: 0.5 }, mb: 2 }} style={{ bottom: "10px" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} style={{ "display": "inline" }} >
              <TextField
                fullWidth
                label="Tapahtuman nimi"
                value={otsikko}
                onChange={(e) => {
                  setOtsikko(e.target.value)
                }}
              />
              {/* {data || infoMuistiArvo ?
                <Grid item xs={12} sm={6}>
                  <Button
                    style={{ margin: "8px" }}
                    variant="contained" onClick={() => infoEsille()}>
                    Info esille
                  </Button>
                </Grid>
                : null} */}
            </Grid>
            <Grid item xs={12} sm={6} >
              {data || infoMuistiArvo ?
                <Grid item xs={12} sm={6} style={{ "display": "inline" }}>
                  <Button
                    variant="contained" onClick={() => infoEsille()}>
                    Info esille
                  </Button>
                </Grid>
                : null}
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
          <Button
            style={{ marginTop: "32px" }}
            variant="contained"
            onClick={() => tapahtumanLuominen()}>luo tapahtuma
          </Button>
        </Paper>
        <div style={{ margin: "2px", opacity: "0" }}>a</div>
      </Container>
    </>
  )
}

export default Lisaaminen