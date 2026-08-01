import os
import shutil
import tkinter as tk
from tkinter import filedialog, messagebox

class FileOrganizerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Auto File Organizer Pro v3.0.1 (100円 App)")
        self.root.geometry("640x480")
        self.root.configure(bg="#090d16")
        self.root.resizable(False, False)

        self.target_dir = None

        # Title Header
        header = tk.Frame(self.root, bg="#0f172a", py=12)
        header.pack(fill="x")

        title = tk.Label(
            header,
            text="📁 Auto File Organizer Pro",
            font=("Segoe UI", 16, "bold"),
            fg="#10b981",
            bg="#0f172a"
        )
        title.pack()

        sub = tk.Label(
            header,
            text="바탕화면 및 다운로드 폴더를 1초 만에 확장자별 깔끔 자동 정돈",
            font=("Segoe UI", 9),
            fg="#94a3b8",
            bg="#0f172a"
        )
        sub.pack()

        # Select Folder Area
        frame_input = tk.Frame(self.root, bg="#090d16", px=20, py=20)
        frame_input.pack(fill="x")

        self.btn_select = tk.Button(
            frame_input,
            text="📂 정리할 폴더 선택하기",
            font=("Segoe UI", 11, "bold"),
            bg="#059669",
            fg="white",
            activebackground="#047857",
            activeforeground="white",
            py=10,
            command=self.select_folder
        )
        self.btn_select.pack(fill="x")

        self.lbl_path = tk.Label(
            frame_input,
            text="선택된 폴더 없음",
            font=("Segoe UI", 10),
            fg="#64748b",
            bg="#090d16"
        )
        self.lbl_path.pack(pady=8)

        # Action Run Button
        self.btn_run = tk.Button(
            self.root,
            text="⚡ 1초 자동 폴더 정리 실행",
            font=("Segoe UI", 12, "bold"),
            bg="#10b981",
            fg="white",
            activebackground="#059669",
            activeforeground="white",
            state="disabled",
            py=12,
            command=self.run_organize
        )
        self.btn_run.pack(fill="x", px=20, py=10)

        # Rules Description Box
        rules_frame = tk.Frame(self.root, bg="#0f172a", px=15, py=10)
        rules_frame.pack(fill="both", expand=True, px=20, py=10)

        lbl_rules_title = tk.Label(
            rules_frame,
            text="[ 자동 생성 및 분류 카테고리 ]",
            font=("Segoe UI", 9, "bold"),
            fg="#a7f3d0",
            bg="#0f172a"
        )
        lbl_rules_title.pack(anchor="w")

        rules_txt = (
            "• 📷 Images/ : png, jpg, jpeg, webp, gif, svg, ico\n"
            "• 📄 Documents/ : pdf, doc, docx, txt, hwp, pptx, xlsx\n"
            "• 📦 Archives/ : zip, rar, 7z, tar, exe, dmg\n"
            "• 🎬 Media/ : mp4, avi, mkv, mp3, wav"
        )
        lbl_rules = tk.Label(
            rules_frame,
            text=rules_txt,
            font=("Consolas", 9),
            fg="#cbd5e1",
            bg="#0f172a",
            justify="left"
        )
        lbl_rules.pack(anchor="w", pady=5)

    def select_folder(self):
        folder = filedialog.askdirectory()
        if not folder:
            return

        self.target_dir = folder
        self.lbl_path.config(text=f"선택됨: {folder}", fg="#34d399")
        self.btn_run.config(state="normal")

    def run_organize(self):
        if not self.target_dir or not os.path.exists(self.target_dir):
            return

        categories = {
            "Images": [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".ico"],
            "Documents": [".pdf", ".doc", ".docx", ".txt", ".hwp", ".pptx", ".xlsx"],
            "Archives": [".zip", ".rar", ".7z", ".tar", ".exe", ".dmg"],
            "Media": [".mp4", ".avi", ".mkv", ".mp3", ".wav"]
        }

        moved_count = 0
        try:
            for file_name in os.listdir(self.target_dir):
                file_path = os.path.join(self.target_dir, file_name)
                if os.path.isdir(file_path):
                    continue

                ext = os.path.splitext(file_name)[1].lower()
                dest_folder = None

                for cat_name, ext_list in categories.items():
                    if ext in ext_list:
                        dest_folder = os.path.join(self.target_dir, cat_name)
                        break

                if dest_folder:
                    os.makedirs(dest_folder, exist_ok=True)
                    shutil.move(file_path, os.path.join(dest_folder, file_name))
                    moved_count += 1

            messagebox.showinfo("정리 완료", f"성공적으로 {moved_count}개 파일을 카테고리별로 정돈했습니다!")
        except Exception as e:
            messagebox.showerror("오류", f"정리 중 오류 발생: {str(e)}")

if __name__ == "__main__":
    root = tk.Tk()
    app = FileOrganizerApp(root)
    root.mainloop()
