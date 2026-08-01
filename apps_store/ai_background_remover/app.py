import os
import sys
import tkinter as tk
from tkinter import filedialog, messagebox
from PIL import Image, ImageTk

try:
    from rembg import remove
except ImportError:
    remove = None

class AIBackgroundRemoverApp:
    def __init__(self, root):
        self.root = root
        self.root.title("AI Smart Remover (1초 배경 제거 툴)")
        self.root.geometry("700x550")
        self.root.configure(bg="#090d16")
        self.root.resizable(False, False)

        self.input_image_path = None
        self.output_image = None

        # Title Banner
        title_frame = tk.Frame(self.root, bg="#0f172a", py=15)
        title_frame.pack(fill="x")

        title_label = tk.Label(
            title_frame,
            text="✨ AI Smart Remover v1.4.0 (100円 App)",
            font=("Segoe UI", 16, "bold"),
            fg="#f43f5e",
            bg="#0f172a"
        )
        title_label.pack()

        sub_label = tk.Label(
            title_frame,
            text="AI 딥러닝 엔진 기반 1초 원클릭 오프라인 누끼 제거 툴",
            font=("Segoe UI", 9),
            fg="#94a3b8",
            bg="#0f172a"
        )
        sub_label.pack()

        # Image Display Area
        display_frame = tk.Frame(self.root, bg="#090d16")
        display_frame.pack(pady=20, fill="both", expand=True)

        self.preview_label = tk.Label(
            display_frame,
            text="[ 이미지를 선택하세요 ]\n\n'이미지 불러오기' 버튼을 클릭하여\n배경을 지울 사진을 선택해 주세요.",
            font=("Segoe UI", 11),
            fg="#64748b",
            bg="#0f172a",
            relief="solid",
            bd=1,
            width=65,
            height=14
        )
        self.preview_label.pack(expand=True)

        # Status Label
        self.status_label = tk.Label(
            self.root,
            text="준비됨",
            font=("Segoe UI", 10),
            fg="#cbd5e1",
            bg="#090d16"
        )
        self.status_label.pack(pady=5)

        # Buttons Frame
        btn_frame = tk.Frame(self.root, bg="#090d16", py=10)
        btn_frame.pack()

        self.btn_load = tk.Button(
            btn_frame,
            text="📁 이미지 불러오기",
            font=("Segoe UI", 10, "bold"),
            bg="#334155",
            fg="white",
            activebackground="#475569",
            activeforeground="white",
            px=15, py=8,
            command=self.load_image
        )
        self.btn_load.pack(side="left", mx=10)

        self.btn_process = tk.Button(
            btn_frame,
            text="⚡ 배경 제거하기 (1초 누끼)",
            font=("Segoe UI", 10, "bold"),
            bg="#e11d48",
            fg="white",
            activebackground="#be123c",
            activeforeground="white",
            px=15, py=8,
            state="disabled",
            command=self.process_image
        )
        self.btn_process.pack(side="left", mx=10)

        self.btn_save = tk.Button(
            btn_frame,
            text="💾 투명 PNG 저장",
            font=("Segoe UI", 10, "bold"),
            bg="#059669",
            fg="white",
            activebackground="#047857",
            activeforeground="white",
            px=15, py=8,
            state="disabled",
            command=self.save_image
        )
        self.btn_save.pack(side="left", mx=10)

    def load_image(self):
        file_path = filedialog.askopenfilename(
            filetypes=[("Image Files", "*.png *.jpg *.jpeg *.webp *.bmp")]
        )
        if not file_path:
            return

        self.input_image_path = file_path
        img = Image.open(file_path)
        img.thumbnail((360, 240))
        img_tk = ImageTk.PhotoImage(img)

        self.preview_label.config(image=img_tk, text="")
        self.preview_label.image = img_tk
        self.status_label.config(text=f"선택됨: {os.path.basename(file_path)}", fg="#38bdf8")

        self.btn_process.config(state="normal")
        self.btn_save.config(state="disabled")

    def process_image(self):
        if not self.input_image_path:
            return

        if remove is None:
            messagebox.showerror(
                "패키지 필요",
                "rembg 패키지가 설치되지 않았습니다.\n명령프롬프트에서 'pip install rembg pillow'를 실행하세요.\n(또는 함께 제공된 index.html 웹 버전을 바로 사용하실 수 있습니다)"
            )
            return

        self.status_label.config(text="AI 모델이 배경을 지우는 중입니다... 잠시만 기다려 주세요.", fg="#f59e0b")
        self.root.update()

        try:
            input_img = Image.open(self.input_image_path)
            self.output_image = remove(input_img)

            preview_img = self.output_image.copy()
            preview_img.thumbnail((360, 240))
            img_tk = ImageTk.PhotoImage(preview_img)

            self.preview_label.config(image=img_tk, text="")
            self.preview_label.image = img_tk

            self.status_label.config(text="✨ 배경 제거 완료! '투명 PNG 저장' 버튼을 눌러 저장하세요.", fg="#4ade80")
            self.btn_save.config(state="normal")
        except Exception as e:
            messagebox.showerror("오류", f"배경 제거 중 오류가 발생했습니다: {str(e)}")
            self.status_label.config(text="오류 발생", fg="#f87171")

    def save_image(self):
        if not self.output_image:
            return

        save_path = filedialog.asksaveasfilename(
            defaultextension=".png",
            filetypes=[("PNG Image", "*.png")]
        )
        if save_path:
            self.output_image.save(save_path)
            messagebox.showinfo("완료", f"성공적으로 저장되었습니다!\n{save_path}")

if __name__ == "__main__":
    root = tk.Tk()
    app = AIBackgroundRemoverApp(root)
    root.mainloop()
