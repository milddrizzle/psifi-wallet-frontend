const getPrivateKey = async (
  encryptedSeed: string,
  salt: string,
  iv: string,
  option: string
): Promise<{ seed: string; privateKey: string }> => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_API_URL + "/getPrivateKey",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        encryptedSeed: encryptedSeed,
        salt: salt,
        iv: iv,
        option: option,
      }),
    }
  );

  const data = await response.json();

  if (response.status === 200 && data.privateKey) {
    return {
      seed: data.seed,
      privateKey: data.privateKey,
    };
  } else {
    throw new Error(data.message || "Failed to fetch private key");
  }
};

export { getPrivateKey };
