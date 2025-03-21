"use client";
import React, { useState, useEffect } from "react";
import { Upload, message } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import { useParams, useRouter } from "next/navigation";
import { useNotification } from "@/app/ui/information/message";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const UploadImagePlat: React.FC = () => {
  const params = useParams();
  const idrestaurant = "28a5e012-bcff-48f5-88e2-baf30a77668a";
  const idplat = params.idplat as string;
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const notification = useNotification();
  const route = useRouter();
  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    setToken(jwtToken);
  }, []);

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const customRequest = async ({ file, onSuccess, onError }: any) => {
    if (!token) {
      message.error("Token d'authentification manquant");
      onError(new Error("Token d'authentification manquant"));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `/api/restaurant/${idrestaurant}/upload/${idplat}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur lors de l'upload: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      //message.success("Upload réussi!");
      notification.success("Upload réussi!");
      route.push('/dashboard/plats/liste');
      const uploadedFile = {
        ...file,
        status: "done",
        url: data.imageUrl || data.url,
      };

      setFileList((prev) => [...prev.filter((f) => f.uid !== file.uid), uploadedFile as UploadFile]);
      onSuccess(data, file);
    } catch (error: any) {
      message.error(`Échec de l'upload: ${error.message}`);
      onError(error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Téléversement d'image</h2>
      <ImgCrop rotationSlider>
        <Upload
          customRequest={customRequest}
          listType="picture-card"
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
        >
          {fileList.length < 5 && "+ Upload"}
        </Upload>
      </ImgCrop>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  title: {
    marginBottom: "20px",
    fontSize: "22px",
    fontWeight: "bold",
    color: "#333",
  },
};

export default UploadImagePlat;
