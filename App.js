import ListHeader from "./components/ListHeader";
import { useEffect, useState } from "react";
import ListItem from "./components/ListItem";
import Auth from "../src/components/Auth";
import { useCookies } from "react-cookie";

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const userEmail = cookies.Email;
  const [tasks, setTasks] = useState(null);
  //const authToken = cookies.AuthToken;
  console.log(cookies.AuthToken);
  const authToken = cookies.AuthToken;
  const getData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/todos/${userEmail}`
      );
      const json = await response.json();
      setTasks(json);
    } catch (err) {
      console.log(err);
    }
  };
  console.log(tasks);

  //sort by date
  const sortedTasks = tasks?.sort((a, b) => new Date(a.date) - Date(b.date));

  useEffect(() => {
    if (authToken) {
      getData();
    }
  }, []);

  return (
    <div className="app">
      {!authToken && <Auth />}
      {authToken && (
        <>
          <ListHeader listName={"🌴 Holiday tick list"} getData={getData} />
          {sortedTasks?.map((tasks) => (
            <ListItem key={tasks.id} task={tasks} getData={getData} />
          ))}
        </>
      )}
    </div>
  );
};

export default App;
