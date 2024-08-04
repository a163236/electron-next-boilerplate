"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

export default function Home() {

  const [helloString, setHelloString] = useState("");
  const [filePath, SetFilePath] = useState<String>("");

  useEffect(() => {
    const handleMessage = (event, args) => {
      setHelloString(args)
    }
    window.electronAPI.receiveHello(handleMessage);
    return () => {
      window.electronAPI.stopReceivingHello(handleMessage);
    };
  }, []);

  const handleOpenFileDialog = () => {
    const filePath = window.electronAPI.openFile();
    SetFilePath(filePath);
  }

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1>electron-next-boilerplate</h1>
      </div>
      <button onClick={() => window.electronAPI.sayHello()}>RendererからMainにmessageを送信して、チャネルを通ったメッセージを表示する</button>
      {helloString}
      <button onClick={ async() => handleOpenFileDialog()}>open dialog file</button>
      {filePath}
    </main>
  );
}
