import tkinter as tk
from tkinter import ttk, messagebox
import pyperclip

class PromptMagicApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Prompt Magic Generator v1.0.5 (100円 App)")
        self.root.geometry("680x580")
        self.root.configure(bg="#090d16")
        self.root.resizable(False, False)

        self.selected_tags = []
        self.ratio_var = tk.StringVar(value="--ar 16:9")

        # Title Header
        header = tk.Frame(self.root, bg="#0f172a", py=12)
        header.pack(fill="x")

        title = tk.Label(
            header,
            text="🪄 Prompt Magic Generator",
            font=("Segoe UI", 16, "bold"),
            fg="#c084fc",
            bg="#0f172a"
        )
        title.pack()

        sub = tk.Label(
            header,
            text="Midjourney v6 & ChatGPT 최고의 프롬프트 자동 생성기",
            font=("Segoe UI", 9),
            fg="#94a3b8",
            bg="#0f172a"
        )
        sub.pack()

        # Subject Input
        frame_input = tk.Frame(self.root, bg="#090d16", px=20, py=10)
        frame_input.pack(fill="x")

        lbl_subj = tk.Label(
            frame_input,
            text="1. 주제 아이디어 (영문 키워드):",
            font=("Segoe UI", 10, "bold"),
            fg="#e2e8f0",
            bg="#090d16"
        )
        lbl_subj.pack(anchor="w", pady=(0, 4))

        self.entry_subj = tk.Entry(
            frame_input,
            font=("Segoe UI", 10),
            bg="#0f172a",
            fg="white",
            insertbackground="white",
            bd=1,
            relief="solid"
        )
        self.entry_subj.insert(0, "Cyberpunk neon city, futuristic cat in the rain")
        self.entry_subj.pack(fill="x", py=2)
        self.entry_subj.bind("<KeyRelease>", lambda e: self.update_prompt())

        # Preset Buttons
        frame_preset = tk.Frame(self.root, bg="#090d16", px=20, py=5)
        frame_preset.pack(fill="x")

        lbl_presets = tk.Label(
            frame_preset,
            text="2. 화풍 및 렌즈 태그 클릭 연동:",
            font=("Segoe UI", 10, "bold"),
            fg="#e2e8f0",
            bg="#090d16"
        )
        lbl_presets.pack(anchor="w", pady=(0, 4))

        tags = [
            "photorealistic", "cinematic lighting", "8k resolution",
            "Studio Ghibli style", "3D Octane render", "Unreal Engine 5",
            "35mm photography", "volumetric lighting", "dramatic shadow"
        ]

        grid_frame = tk.Frame(frame_preset, bg="#090d16")
        grid_frame.pack(fill="x")

        for idx, tag in enumerate(tags):
            r = idx // 3
            c = idx % 3
            btn = tk.Button(
                grid_frame,
                text=tag,
                font=("Segoe UI", 8),
                bg="#1e293b",
                fg="#cbd5e1",
                activebackground="#a855f7",
                activeforeground="white",
                command=lambda t=tag: self.toggle_tag(t)
            )
            btn.grid(row=r, column=c, padx=3, pady=3, sticky="ew")

        grid_frame.columnconfigure(0, weight=1)
        grid_frame.columnconfigure(1, weight=1)
        grid_frame.columnconfigure(2, weight=1)

        # Output Box
        frame_out = tk.Frame(self.root, bg="#090d16", px=20, py=10)
        frame_out.pack(fill="both", expand=True)

        lbl_out = tk.Label(
            frame_out,
            text="3. 완성된 Midjourney v6 프롬프트:",
            font=("Segoe UI", 10, "bold"),
            fg="#c084fc",
            bg="#090d16"
        )
        lbl_out.pack(anchor="w", pady=(0, 4))

        self.txt_out = tk.Text(
            frame_out,
            height=5,
            font=("Consolas", 10),
            bg="#0f172a",
            fg="#4ade80",
            insertbackground="white",
            wrap="word",
            bd=1,
            relief="solid"
        )
        self.txt_out.pack(fill="both", expand=True)

        # Copy Button
        btn_copy = tk.Button(
            self.root,
            text="📋 클립보드 원클릭 복사",
            font=("Segoe UI", 11, "bold"),
            bg="#9333ea",
            fg="white",
            activebackground="#7e22ce",
            activeforeground="white",
            py=10,
            command=self.copy_to_clipboard
        )
        btn_copy.pack(fill="x", px=20, py=15)

        self.update_prompt()

    def toggle_tag(self, tag):
        if tag in self.selected_tags:
            self.selected_tags.remove(tag)
        else:
            self.selected_tags.append(tag)
        self.update_prompt()

    def update_prompt(self):
        subject = self.entry_subj.get().strip()
        if not subject:
            subject = "Futuristic image"

        tags_str = ", ".join(self.selected_tags)
        if tags_str:
            full_prompt = f"{subject}, {tags_str} {self.ratio_var.get()} --v 6.0 --stylize 250"
        else:
            full_prompt = f"{subject} {self.ratio_var.get()} --v 6.0 --stylize 250"

        self.txt_out.delete("1.0", tk.END)
        self.txt_out.insert(tk.END, full_prompt)

    def copy_to_clipboard(self):
        content = self.txt_out.get("1.0", tk.END).strip()
        try:
            pyperclip.copy(content)
        except Exception:
            self.root.clipboard_clear()
            self.root.clipboard_append(content)
        messagebox.showinfo("복사 완료", "프롬프트가 클립보드에 성공적으로 복사되었습니다!")

if __name__ == "__main__":
    root = tk.Tk()
    app = PromptMagicApp(root)
    root.mainloop()
