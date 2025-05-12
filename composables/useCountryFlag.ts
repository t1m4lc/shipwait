export const useCountryFlag = () => {
  const countryCodeToFlag = (code: string): string => {
    if (!code || code.length !== 2) return "";

    const upperCode = code.toUpperCase();
    const isValid = /^[A-Z]{2}$/.test(upperCode);

    if (!isValid) return "";

    const flag = [...upperCode]
      .map((char) => String.fromCodePoint(char.codePointAt(0)! + 127397))
      .join("");

    return flag;
  };

  return {
    countryCodeToFlag,
  };
};
