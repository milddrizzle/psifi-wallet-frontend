"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";

const CoinPriceContext = createContext({});

export const CoinPriceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [coinPrice, setCoinPrice] = useState({
    bitcoin: 0,
    solana: 0,
    ethereum: 0,
    avalanche: 0,
    bsc: 0,
    usd: 1,
    eur: 1,
    jpy: 1,
    gbp: 1,
  });

  useEffect(() => {
    const fetchPrices = () => {
      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,avalanche-2,binancecoin&vs_currencies=usd"
      )
        .then((response) => response.json())
        .then((data) => {
          // Set cookies
          Cookies.set(
            "crypto-price",
            JSON.stringify({
              bitcoin: data.bitcoin.usd,
              solana: data.solana.usd,
              ethereum: data.ethereum.usd,
              avalanche: data["avalanche-2"].usd,
              bsc: data.binancecoin.usd,
            }),
            { expires: 1 }
          );
        })
        .catch((error) => {
          console.error(error);
        });
      fetch("https://api.exchangerate-api.com/v4/latest/USD")
        .then((response) => response.json())
        .then((data) => {
          // Set cookies
          Cookies.set(
            "fiat-rate",
            JSON.stringify({
              eur: data.rates.EUR,
              jpy: data.rates.JPY,
              gbp: data.rates.GBP,
            }),
            { expires: 1 }
          );
        })
        .catch((error) => {
          console.error(error);
        });
      const _crypto_price = Cookies.get("crypto-price");
      const _fiat_rate = Cookies.get("fiat-rate");
      if (_crypto_price) {
        const crypto_price = JSON.parse(_crypto_price);
        // @ts-ignore
        setCoinPrice((prevPrice) => ({
          ...prevPrice,
          bitcoin: crypto_price.bitcoin,
          solana: crypto_price.solana,
          ethereum: crypto_price.ethereum,
          avalanche: crypto_price.avalanche,
          bsc: crypto_price.bsc,
        }));
      }
      if (_fiat_rate) {
        const fiat_rate = JSON.parse(_fiat_rate);
        // @ts-ignore
        setCoinPrice((prevPrice) => ({
          ...prevPrice,
          usd: 1,
          eur: fiat_rate.eur,
          jpy: fiat_rate.jpy,
          gbp: fiat_rate.gbp,
        }));
      }
    };

    fetchPrices();
    const intervalId = setInterval(fetchPrices, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <CoinPriceContext.Provider value={coinPrice}>
      {children}
    </CoinPriceContext.Provider>
  );
};

export const useCoinPrice = () => useContext(CoinPriceContext);
