import { HTMLRewriter } from 'https://raw.githubusercontent.com/worker-tools/html-rewriter/master/index.ts'
import { Context } from 'https://edge.netlify.com'

export default async (_req: Request, context: Context) => {
  const languages: { [key: string]: string } = {
    DE: 'de',
    ES: 'es',
    CN: 'zh',
    FR: 'fr',
    NL: 'nl',
    RU: 'ru',
    US: 'en',
  }
  const countries: { [key: string]: string } = {
    DE: 'Germany',
    ES: 'Spain',
    CN: 'China',
    FR: 'France',
    NL: 'The Netherlands',
    RU: 'Russia',
    US: 'The United States',
    XX: 'some random place'
  }
  const country: string = context.geo?.country?.code || 'XX'

  const res = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    body: JSON.stringify({
      q: "Good afternoon, this is an example of text translation using edge functions!",
      source: "en",
      target: languages[country],
      format: "text",
      api_key: ""
    }),
    headers: { "Content-Type": "application/json;charset=UTF-8" }
  });

  const translation = await res.json()

  const response = await context.next();

  return new HTMLRewriter()
      .on(".hello", {
        element(e) {
          e.setInnerContent(translation.translatedText)
        },
      })
      .on(".country", {
        element(e) {
          e.setInnerContent(`You are in ${countries[country]}`)
        }
      })
    .transform(response)
}