import Modal from "./Modal";
import { useState } from "react";
import TickIcon from "./TickIcon";
import ProgressBar from "./ProgressBar";
const ListItem = ({ task, getData }) => {
  const deleteItem = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_SERVERURL}/todos/${task.id}`,
      {
        method: "DELETE",
      }
    );
    if (response.status === 200) {
      getData();
    }
  };
  const [showModal, setShowModal] = useState(false);
  console.log(task);
  return (
    <li className="list-item">
      <div className="info-container">
        <TickIcon />
        <p className="task-title">{task.title}</p>
        <ProgressBar />
      </div>

      <div className="button-container">
        <button className="edit" onClick={() => setShowModal(true)}>
          EDIT
        </button>
        <button className="delete" onClick={deleteItem}>
          DELETE
        </button>
      </div>
      {showModal && (
        <Modal
          mode={"edit"}
          setShowModal={setShowModal}
          getData={getData}
          task={task}
        />
      )}
    </li>
  );
};
export default ListItem;
