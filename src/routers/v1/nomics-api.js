import KoaRouter from "@koa/router"
import got from "got"


export const nomicsRouter = new KoaRouter();

// nomicsRouter.get(/^\/v1(?:\/|$)/, async (ctx) => {
//     const {request} = ctx;
//     const {} = request.params;
//     const response = await got.get('https://api.nomics.com/v1/currencies/sparkline?key=9d5780d97bce8d6019393ccbc5f0cd45&ids=BTC,ETH,XRP&start=2021-02-20T00%3A00%3A00Z&end=2021-03-02T00%3A00%3A00Z');
//     ctx.body = JSON.parse(response.body)
// })

nomicsRouter.get(/^\/v1(?:\/|$)/, async (ctx) => {
    const {request} = ctx;
    const {query} = request;
    const response = await got.get('https://api.nomics.com/v1/currencies/sparkline', {searchParams: {key: '9d5780d97bce8d6019393ccbc5f0cd45', ...query}});
    ctx.body = JSON.parse(response.body)
})



