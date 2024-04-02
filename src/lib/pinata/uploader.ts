const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmOTFiYzM1MS1lNmJhLTRjNGUtYTM3ZC1mOTcyYzc5OTA5M2UiLCJlbWFpbCI6InJhbW9zbGlsYTgxN0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZDdiNWI4YTM5YWQ4ZGFlYjFlNmMiLCJzY29wZWRLZXlTZWNyZXQiOiI4NDc4YTcxOGQzNWE2YzYxNDA4NGM0NjhiNGZmYjMzZWU4NTBlODIwZTE4Y2VmZGNmMTQwN2FkYzJlMmUxMWM5IiwiaWF0IjoxNzA5MDA3MzI0fQ.7KjjYTbS6zyhWbDblyDlxIota3McatMgsrPFAv6ejGQ";

export const pinFileToIPFS = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const pinataOptions = {
    cidVersion: 0,
  };
  formData.append("pinataOptions", JSON.stringify(pinataOptions));

  try {
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error pinning file to IPFS:", errorData);
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    const url = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
    return url;
  } catch (error) {
    console.error("Error in pinFileToIPFS:", error);
  }
};
