import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // 🔹 Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_URL}/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 🔹 Create post
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_URL}/posts`,
        { text, image },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts([res.data, ...posts]);
      setText("");
      setImage("");
      setMessage("✅ Post created successfully!");
    } catch (err) {
      setMessage("❌ Failed to create post");
    }
  };

  // 🔹 Delete post (FIXED)
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await axios.delete(`${API_URL}/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete post");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "30px auto" }}>
      <h2>LinkedIn Feed</h2>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          style={{ width: "100%", height: "80px" }}
        />

        <input
          type="text"
          placeholder="Image URL (optional)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          style={{ width: "100%", marginTop: "10px" }}
        />

        <button type="submit" style={{ marginTop: "10px" }}>
          Post
        </button>
      </form>

      {message && <p>{message}</p>}

      <hr />

      {posts.map((post) => (
        <div
          key={post._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <strong>{post.user?.name}</strong>
          <p>{post.text}</p>

          {/* 🔹 IMAGE LINK AS ICON */}
          {post.image && (
            <p>
              🖼️{" "}
              <a href={post.image} target="_blank" rel="noreferrer">
                View Image
              </a>
            </p>
          )}

          <small>{new Date(post.createdAt).toLocaleString()}</small>

          <br />

          {/* 🔹 DELETE BUTTON */}
          <button
            onClick={() => handleDelete(post._id)}
            style={{
              marginTop: "5px",
              background: "red",
              color: "white",
              border: "none",
              padding: "5px",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Posts;
