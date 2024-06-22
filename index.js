const axios = require("axios");
const moment = require("moment");
const fs = require("fs");

var file = fs.readFileSync("token.txt", "utf-8");
var splitToken = file.split("\r\n");
console.clear();

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const nominal = (number, locale = "id-ID") => {
  return new Intl.NumberFormat(locale, {
    style: "decimal",
  }).format(number);
};

const getAccountInfo = async (token) => {
  try {
    const response = await axios.get(
      "https://api.yescoin.gold/account/getAccountInfo",
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Accept-Encoding": "gzip, deflate, br, zstd",
          "Accept-Language": "en-US,en;q=0.9",
          Origin: "https://www.yescoin.gold",
          Priority: "u=1, i",
          Referer: "https://www.yescoin.gold/",
          "Sec-Ch-Ua":
            '"Chromium";v="124", "Microsoft Edge";v="124", "Not-A.Brand";v="99", "Microsoft Edge WebView2";v="124"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Platform": '"Windows"',
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-site",
          Token: token,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const getAccountBuildInfo = async (token) => {
  try {
    const response = await axios.get(
      "https://api.yescoin.gold/build/getAccountBuildInfo",
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Accept-Encoding": "gzip, deflate, br, zstd",
          "Accept-Language": "en-US,en;q=0.9",
          Origin: "https://www.yescoin.gold",
          Priority: "u=1, i",
          Referer: "https://www.yescoin.gold/",
          "Sec-Ch-Ua":
            '"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24", "Microsoft Edge WebView2";v="125"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Platform": '"Windows"',
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-site",
          Token: token,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

async function recoverCoinPool(token) {
  try {
    const response = await axios.post(
      "https://api.yescoin.gold/game/recoverCoinPool",
      null,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/x-www-form-urlencoded",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24", "Microsoft Edge WebView2";v="125"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          token: token,
          Referer: "https://www.yescoin.gold/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

const collectCoin = async (token, detail) => {
  const dataToSend = 9;
  const url = "https://api.yescoin.gold/game/collectCoin";
  const headers = {
    Accept: "application/json, text/plain, */*",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "no-cache",
    "Content-Length": "1",
    "Content-Type": "application/json",
    Origin: "https://www.yescoin.gold",
    Pragma: "no-cache",
    Referer: "https://www.yescoin.gold/",
    "Sec-Ch-Ua":
      '"Chromium";v="124", "Microsoft Edge";v="124", "Not-A.Brand";v="99", "Microsoft Edge WebView2";v="124"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-site",
    Token: token,
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
  };

  try {
    const response = await axios.post(url, dataToSend, { headers });
    const { message, data: responseData } = response.data;

    if (message !== "Success") {
      let accountBuildInfo = await getAccountBuildInfo(token);
      let recoveryCount = accountBuildInfo.data.coinPoolLeftRecoveryCount;

      if (recoveryCount > 0) {
        await recoverCoinPool(token);
        console.log("========================================");
        console.log(
          `[ ${moment().format("HH:mm:ss")} ] Success! Recovery Coin`
        );
        console.log("========================================");
        await delay(2000);
        await collectCoin(token, detail);
      } else {
        console.log(
          `[ ${moment().format(
            "HH:mm:ss"
          )} ] Energy 0 & Recovery 0! Delay 10 Seconds`
        );

        await delay(10000);
      }
    } else {
      console.log(
        `[ ${moment().format("HH:mm:ss")} ] ${detail} : ${
          responseData.collectAmount
        } Point Claim`
      );

      await collectCoin(token, detail);
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const start = async () => {
  try {
    while (true) {
      for (let i = 0; i < splitToken.length; i++) {
        try {
          console.log("========================================");
          console.log(
            `[ ${moment().format("HH:mm:ss")} ] Process Token  : ${i + 1}/${
              splitToken.length
            }`
          );

          const token = splitToken[i];
          const accountInfo = await getAccountInfo(token);
          const accountBuildInfo = await getAccountBuildInfo(token);

          console.log(
            `[ ${moment().format("HH:mm:ss")} ] Current Amount : ${nominal(
              accountInfo.data.currentAmount
            )}`
          );
          console.log(
            `[ ${moment().format("HH:mm:ss")} ] Recovery       : ${
              accountBuildInfo.data.coinPoolLeftRecoveryCount
            }`
          );
          console.log("========================================");

          await collectCoin(token, `${i + 1}/${splitToken.length}`);
        } catch (error) {
          console.error(`Error processing token ${i + 1}:`, error);
        }
      }

      console.log("========================================");
      console.log(
        `[ ${moment().format("HH:mm:ss")} ] All Token Claimed! Delay 3 Minutes`
      );

      await delay(180000);
    }
  } catch (error) {
    console.error("Critical error occurred. Restarting the process...", error);
    start();
  }
};

start();
