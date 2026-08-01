import tkinter as tk
from tkinter import ttk, messagebox

class CodeVaultApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Code Snippet Vault v1.1.0 (100円 App)")
        self.root.geometry("680x560")
        self.root.configure(bg="#090d16")
        self.root.resizable(False, False)

        self.snippets = [
            ("React Custom Fetch Hook", "TypeScript", "export function useFetch(url) { ... }"),
            ("Python Rembg Wrapper", "Python", "from rembg import remove\noutput = remove(img)"),
            ("Tailwind Glassmorphism", "CSS", ".glass { backdrop-filter: blur(16px); }"),
            ("PostgreSQL User Query", "SQL", "SELECT * FROM users WHERE active = true;")
        ]

        # Title Header
        header = tk.Frame(self.root, bg="#0f172a", py=12)
        header.pack(fill="x")

        title = tk.Label(
            header,
            text="🔐 Code Snippet Vault",
            font=("Segoe UI", 16, "bold"),
            fg="#f59e0b",
            bg="#0f172a"
        )
        title.pack()

        sub = tk.Label(
            header,
            text="자주 쓰는 코드 조각과 설정값을 캡슐로 보관하고 원클릭 복사",
            font=("Segoe UI", 9),
            fg="#94a3b8",
            bg="#0f172a"
        )
        sub.pack()

        # List Area
        frame_main = tk.Frame(self.root, bg="#090d16", px=20, py=10)
        frame_main.pack(fill="both", expand=True)

        lbl_list = tk.Label(
            frame_main,
            text="저장된 코드 스니펫 목록:",
            font=("Segoe UI", 10, "bold"),
            fg="#e2e8f0",
            bg="#090d16"
        )
        lbl_list.pack(anchor="w", pady=(0, 4))

        self.lst_snips = tk.Listbox(
            frame_main,
            font=("Segoe UI", 10),
            bg="#0f172a",
            fg="white",
            selectbackground="#f59e0b",
            selectforeground="black",
            height=6,
            bd=1,
            relief="solid"
        )
        for title, lang, _ in self.snippets:
            self.lst_snips.insert(tk.END, f"[{lang}] {title}")
        self.lst_snips.pack(fill="x")
        self.lst_snips.bind("<<ListboxSelect>>", self.on_select)

        # Code Preview Box
        lbl_code = tk.Label(
            frame_main,
            text="코드 내용:",
            font=("Segoe UI", 10, "bold"),
            fg="#f59e0b",
            bg="#090d16"
        )
        lbl_code.pack(anchor="w", pady=(8, 4))

        self.txt_code = tk.Text(
            frame_main,
            height=8,
            font=("Consolas", 10),
            bg="#0f172a",
            fg="#fbbf24",
            insertbackground="white",
            wrap="word",
            bd=1,
            relief="solid"
        )
        self.txt_code.pack(fill="both", expand=True)

        # Copy Button
        btn_copy = tk.Button(
            self.root,
            text="📋 클립보드 원클릭 복사",
            font=("Segoe UI", 11, "bold"),
            bg="#d97706",
            fg="white",
            activebackground="#b45309",
            activeforeground="white",
            py=8,
            command=self.copy_code
        )
        btn_copy.pack(fill="x", px=20, py=15)

        self.lst_snips.select_set(0)
        self.on_select(None)

    def on_select(self, event):
        sel = self.lst_snips.curselection()
        if not sel:
            return
        idx = sel[0]
        _, _, code = self.snippets[idx]
        self.txt_code.delete("1.0", tk.END)
        self.txt_code.insert(tk.END, code)

    def copy_code(self):
        code = self.txt_code.get("1.0", tk.END).strip()
        self.root.clipboard_clear()
        self.root.clipboard_append(code)
        messagebox.showinfo("복사 완료", "스니펫 코드가 클립보드에 복사되었습니다!")

if __name__ == "__main__":
    root = tk.Tk()
    app = CodeVaultApp(root)
    root.mainloop()
