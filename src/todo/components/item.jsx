import { memo, useState, useCallback, useEffect } from "react";
import classnames from "classnames";

import { Input } from "./input";

import { TOGGLE_ITEM, REMOVE_ITEM, UPDATE_ITEM, ADD_ITEM } from "../constants";

export const Item = memo(function Item({
  todo,
  dispatch,
  index,
  todos,
  completedTodo,
  markCompletedTodo,
  getColorBasedOnIndex,
}) {
  useEffect(() => {
    console.log(completedTodo, "DSDFJHGHEJKDOEICDUYG");
  });
  const [isWritable, setIsWritable] = useState(false);
  const { title, completed, id } = todo;
  const [isNewlyAdded, setIsNewlyAdded] = useState(true);
  const [textColor, setTextColor] = useState("red");
  const [completedTime, setCompletedTime] = useState(null);
  const [addedTime, setAddedTime] = useState(null);

  const currentTime = new Date().toLocaleString();

  useEffect(() => {
    if (isNewlyAdded) {
      setAddedTime(currentTime);
      const timeout = setTimeout(() => {
        setIsNewlyAdded(false);
        setTextColor("black");
      }, 15000);

      return () => clearTimeout(timeout);
    }
  }, [isNewlyAdded]);

  useEffect(() => {
    const color = getColorBasedOnIndex;
    console.log(color);
    setTextColor(color);
    if (todo.completed) {
      setCompletedTime(currentTime);
    }
  }, [todo, getColorBasedOnIndex]);

  const toggleItem = useCallback(() => {
    markCompletedTodo(id);
    dispatch({ type: TOGGLE_ITEM, payload: { id } });
  }, [dispatch, id, completed, todo, todos, currentTime]);
  const removeItem = useCallback(
    () => dispatch({ type: REMOVE_ITEM, payload: { id } }),
    [dispatch]
  );
  const updateItem = useCallback(
    (id, title) => dispatch({ type: UPDATE_ITEM, payload: { id, title } }),
    [dispatch]
  );

  const handleDoubleClick = useCallback(() => {
    setIsWritable(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsWritable(false);
  }, []);

  const handleUpdate = useCallback(
    (title) => {
      if (title.length === 0) removeItem(id);
      else updateItem(id, title);

      setIsWritable(false);
    },
    [id, removeItem, updateItem]
  );

  return (
    <li
      className={classnames({
        completed: todo.completed,
        newlyAdded: isNewlyAdded,
      })}
      data-testid="todo-item"
    >
      <div className="view">
        {isWritable ? (
          <Input
            onSubmit={handleUpdate}
            label="Edit Todo Input"
            defaultValue={title}
            onBlur={handleBlur}
          />
        ) : (
          <>
            <input
              className="toggle"
              type="checkbox"
              data-testid="todo-item-toggle"
              checked={completed}
              onChange={toggleItem}
            />
            <label
              data-testid="todo-item-label"
              style={{ color: textColor }}
              onDoubleClick={handleDoubleClick}
            >
              {title}
            </label>
            <button
              className="destroy"
              data-testid="todo-item-button"
              onClick={removeItem}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                fontSize: "16px",
              }}
            >
              {addedTime && <span>Added: {addedTime}</span>}
              {completed && <span>Completed: {completedTime}</span>}
            </div>
          </>
        )}
      </div>
    </li>
  );
});
