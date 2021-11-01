import { Resolver, Query, Mutation, Arg } from "type-graphql"
import service from "../db/serviceV2"
import { Tapahtuma } from "../type/tapahtuma"
import {
    PalautettavaKirjautumisInfo,
    PalautettavaTapahtuma,
    KirjautuminenInput,
    TapahtumaLuominenInput,
    AaniInput,
    EhdotusInput,
    Kirjautuminen
} from "../type/tapahtuma"

@Resolver(of => PalautettavaTapahtuma)
export class TapahtumaResolver {
    @Query(returns => Kirjautuminen)
    async kirjautuminen(
        @Arg("tunnukset") tunnukset: KirjautuminenInput
    ) {
        const tokenNimiJaId = service.kirjautuminen(tunnukset)
        return tokenNimiJaId
    }

    @Query(returns => PalautettavaTapahtuma)
    async dbKaikkiHaku(
        @Arg("token") token: string
    ) {
        const data = await service.haeKaikki(token)
        return data
    }

    @Mutation(/* of => String */returns => PalautettavaKirjautumisInfo)
    async lisaaTapahtuma(
        @Arg("tapahtuma") tapahtuma: TapahtumaLuominenInput
    ): Promise</* String */PalautettavaKirjautumisInfo> {
        console.log("lisaaminen kaynnistetty")
        const payload = tapahtuma
        const tapahtumaInfo = await service.luominen(payload)
        console.log("lisaatapahtuma mutaatio")
        console.log(tapahtumaInfo)
        return tapahtumaInfo
    }

    @Mutation(of => String)
    async ehdottaminen(
        @Arg("ehdotus") ehdotus: EhdotusInput
    ): Promise<String> {
        const payload = ehdotus
        const palaute = await service.ehdotusLisays(payload)
        return palaute
    }

    @Mutation(of => String)
    async aanestaminen(
        @Arg("aani") aani: AaniInput
    ): Promise<String> {
        const payload = aani
        const lahetettyAani = service.aanestaminen(payload)
        return "hei"
    }
}