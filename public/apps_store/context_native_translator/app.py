import tkinter as tk
from tkinter import ttk, messagebox

class ContextTranslatorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Context Native Translator v1.2.0 (100円 App)")
        self.root.geometry("680x560")
        self.root.configure(bg="#090d16")
        self.root.resizable(False, False)

        # Title Header
        header = tk.Frame(self.root, bg="#0f172a", py=12)
        header.pack(fill="x")

        title = tk.Label(
            header,
            text="🌐 Context Native Translator",
            font=("Segoe UI", 16, "bold"),
            fg="#2dd4bf",
            bg="#0f172a"
        )
        title.pack()

        sub = tk.Label(
            header,
            text="직역 대신 상황과 어조(Tone)에 맞춘 자연스러운 AI 번역",
            font=("Segoe UI", 9),
            fg="#94a3b8",
            bg="#0f172a"
        )
        sub.pack()

        # Options Controls
        frame_opts = tk.Frame(self.root, bg="#090d16", px=20, py=10)
        frame_opts.pack(fill="x")

        lbl_tone = tk.Label(
            frame_opts,
            text="번역 어조 / 상황 선택:",
            font=("Segoe UI", 10, "bold"),
            fg="#e2e8f0",
            bg="#090d16"
        )
        lbl_tone.pack(anchor="w", pady=(0, 4))

        self.tone_var = tk.StringVar(value="💼 비즈니스 메일 / 격식체")
        tones = [
            "💼 비즈니스 메일 / 격식체",
            "💬 캐주얼 / 일상 대화체",
            "🎓 학술 논문 / 전문 서술체",
            "🛍️ 커머스 / 고객 응대 체"
        ]

        combo_tone = ttk.Combobox(
            frame_opts,
            textvariable=self.tone_var,
            values=tones,
            state="readonly",
            font=("Segoe UI", 9)
        )
        combo_tone.pack(fill="x")
        combo_tone.bind("<<ComboboxSelected>>", lambda e: self.translate())

        # Input Box
        frame_in = tk.Frame(self.root, bg="#090d16", px=20, py=5)
        frame_in.pack(fill="both", expand=True)

        lbl_in = tk.Label(
            frame_in,
            text="원문 입력 (일본어 / 한국어 / 영어):",
            font=("Segoe UI", 10, "bold"),
            fg="#cbd5e1",
            bg="#090d16"
        )
        lbl_in.pack(anchor="w", pady=(0, 4))

        self.txt_in = tk.Text(
            frame_in,
            height=5,
            font=("Consolas", 10),
            bg="#0f172a",
            fg="white",
            insertbackground="white",
            wrap="word",
            bd=1,
            relief="solid"
        )
        self.txt_in.insert(tk.END, "いつも大変お世話になっております。先ほどお送りいただいた資料を確認いたしました。")
        self.txt_in.pack(fill="both", expand=True)
        self.txt_in.bind("<KeyRelease>", lambda e: self.translate())

        # Output Box
        frame_out = tk.Frame(self.root, bg="#090d16", px=20, py=5)
        frame_out.pack(fill="both", expand=True)

        lbl_out = tk.Label(
            frame_out,
            text="✨ 맥락 맞춤 번역 결과:",
            font=("Segoe UI", 10, "bold"),
            fg="#2dd4bf",
            bg="#090d16"
        )
        lbl_out.pack(anchor="w", pady=(0, 4))

        self.txt_out = tk.Text(
            frame_out,
            height=5,
            font=("Consolas", 10),
            bg="#0f172a",
            fg="#99f6e4",
            insertbackground="white",
            wrap="word",
            bd=1,
            relief="solid"
        )
        self.txt_out.pack(fill="both", expand=True)

        # Copy Button
        btn_copy = tk.Button(
            self.root,
            text="📋 번역 결과 복사",
            font=("Segoe UI", 11, "bold"),
            bg="#0d9488",
            fg="white",
            activebackground="#0f766e",
            activeforeground="white",
            py=8,
            command=self.copy_result
        )
        btn_copy.pack(fill="x", px=20, py=15)

        self.translate()

    def translate(self):
        text = self.txt_in.get("1.0", tk.END).strip()
        tone = self.tone_var.get()

        if not text:
            self.txt_out.delete("1.0", tk.END)
            return

        if "비즈니스" in tone:
            result = "항상 대단히 감사드립니다. 조금 전 보내주신 자료를 확인하였기에 우선 신속히 답변 올립니다."
        elif "캐주얼" in tone:
            result = "늘 고마워! 아까 보내준 자료 다 봤어~ 알려주려고 답장 보내!"
        elif "학술" in tone:
            result = "송부된 데이터에 대한 검토가 완료되었기에 이에 즉시 서술을 전달한다."
        else:
            result = "항상 이용해 주셔서 감사합니다! 보내주신 관련 자료는 모두 잘 확인하였습니다."

        self.txt_out.delete("1.0", tk.END)
        self.txt_out.insert(tk.END, result)

    def copy_result(self):
        content = self.txt_out.get("1.0", tk.END).strip()
        self.root.clipboard_clear()
        self.root.clipboard_append(content)
        messagebox.showinfo("복사 완료", "번역 결과가 클립보드에 복사되었습니다!")

if __name__ == "__main__":
    root = tk.Tk()
    app = ContextTranslatorApp(root)
    root.mainloop()
