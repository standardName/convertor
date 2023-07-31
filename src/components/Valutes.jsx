import { useEffect, useState } from "react";

export default function Valutes() {
  const [data, setData] = useState([]);
  const [rubValue, setRubValue] = useState("");
  const [valuteValue, setValuteValue] = useState("");
  const [show, setShow] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://www.cbr-xml-daily.ru/daily_json.js");
        const data = await res.json();
        setData(Object.values(data.Valute));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);
 
  function handleConvert(arg) {
    setShow(arg);
    setRubValue("");
    setValuteValue("");
  }

  function handleRubValue(e, valute, nominal) {
    const rubValue = e.target.value;

    setRubValue(rubValue);

    if (nominal > 1) {
      setValuteValue((rubValue / valute) * nominal);
    } else {
      setValuteValue(rubValue / valute);
    }
  }
  function handleValuteValue(e, valute, nominal) {
    const valuteValue = e.target.value;
    setValuteValue(valuteValue);

    if (nominal > 1) {
      setRubValue((valuteValue / nominal) * valute);
    } else {
      setRubValue(valute * valuteValue);
    }
  }
  return (
    <div className="valutes-block">
      {data?.map((el) => {
        return (
          <>
            <div
              className={show === el.NumCode ? "valutes active" : "valutes"}
              key={el.CharCode}
              onClick={() => handleConvert(el.NumCode)}
            >
              <div>{el?.Name}</div>

              <div className="convert-div">{el.Value}</div>
            </div>
            {show === el.NumCode && (
              <div className="convert-absolute">
                {" "}
                <label htmlFor="charcode">{el.CharCode}</label>
                <input
                  type="number"
                  id="charcode"
                  value={valuteValue}
                  onChange={(e) => handleValuteValue(e, el.Value, el.Nominal)}
                  placeholder={el.Name}
                />{" "}
                <br />
                <label htmlFor="rub">RUB</label>
                <input
                  type="number"
                  id="rub"
                  value={rubValue}
                  onChange={(e) => handleRubValue(e, el.Value, el.Nominal)}
                  placeholder="Рубль"
                />{" "}
              </div>
            )}
          </>
        );
      })}
    </div>
  );
}
