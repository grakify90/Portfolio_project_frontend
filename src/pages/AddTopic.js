import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { storage } from "../firebase";
import { addTopic } from "../store/topics/actions";
import { selectToken } from "../store/user/selectors";

import { TitleBlock } from "../styles/TitleBlock";
import { Button } from "../styles/Button";
import { FormContainer } from "../styles/FormContainer";
import { InnerFormContainer } from "../styles/InnerFormContainer";

export default function AddTopic() {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const history = useHistory();

  useEffect(() => {
    if (token === null) {
      history.push("/");
    }
  }, [dispatch, token, history]);

  const [topic, setTopic] = useState({ title: "", content: "", imageUrl: "" });

  async function submitForm(event) {
    event.preventDefault();
    if (topic.image) {
      try {
        //Uploading local file to Firebase and enpoint and receiving URL back
        const uploadTask = storage
          .ref(`images/${topic.imageUrl.name}`)
          .put(topic.imageUrl);

        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            console.log(error);
          },
          () => {
            storage
              .ref("images")
              .child(topic.imageUrl.name)
              .getDownloadURL()
              .then((url) => {
                dispatch(addTopic({ ...topic, imageUrl: url }));
                setTopic({ title: "", content: "", imageUrl: "" });
              });
          }
        );
      } catch (error) {
        console.log(error.message);
      }
    } else {
      dispatch(addTopic({ ...topic, imageUrl: "" }));
    }
  }

  return (
    <div>
      <form>
        <h1>Add a topic</h1>
        <FormContainer>
          <InnerFormContainer>
            <TitleBlock>Title</TitleBlock>
            <input
              value={topic.title}
              onChange={(event) =>
                setTopic({ ...topic, title: event.target.value })
              }
              type="text"
              placeholder="Title"
              required
            />
          </InnerFormContainer>
          <InnerFormContainer>
            <TitleBlock>Content</TitleBlock>
            <textarea
              value={topic.content}
              onChange={(event) =>
                setTopic({ ...topic, content: event.target.value })
              }
              placeholder="What's up?"
              required
            />
          </InnerFormContainer>{" "}
          <InnerFormContainer>
            <TitleBlock>Image</TitleBlock>
            <input
              type="file"
              onChange={(event) =>
                event.target.files[0] &&
                setTopic({ ...topic, imageUrl: event.target.files[0] })
              }
            />
          </InnerFormContainer>
        </FormContainer>
        <div>
          <Button onClick={submitForm}>Submit</Button>
        </div>
      </form>
    </div>
  );
}
