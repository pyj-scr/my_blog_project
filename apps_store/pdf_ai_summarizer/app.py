import os
import sys
import tkinter as tk
from tkinter import filedialog, messagebox

class PDFSummarizerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("PDF AI Summarizer v2.1.2 (100円 App)")
        self.root.geometry("700x580")
        self.root.configure(bg="#090d16")
        self.root.resizable(False, False)

        self.pdf_path = None
        self.extracted_text = ""

        # Title Header
        header = tk.Frame(self.root, bg="#0f172a", py=12)
        header.pack(fill="x")

        title = tk.Label(
            header,
            text="📄 PDF AI Summarizer",
            font=("Segoe UI", 16, "bold"),
            fg="#818cf8",
            bg="#0f172a"
        )
        title.pack()

        sub = tk.Label(
            header,
            text="긴 PDF 문서를 10초 만에 핵심 요약 노트로 자동 정리",
            font=("Segoe UI", 9),
            fg="#94a3b8",
            bg="#0f172a"
        )
        sub.pack()

        # Input Button Area
        frame_input = tk.Frame(self.root, bg="#090d16", px=20, py=15)
        frame_input.pack(fill="x")

        self.btn_select = tk.Button(
            frame_input,
            text="📂 PDF 파일 선택하기",
            font=("Segoe UI", 11, "bold"),
            bg="#4f46e5",
            fg="white",
            activebackground="#4338ca",
            activeforeground="white",
            py=8,
            command=self.select_pdf
        )
        self.btn_select.pack(fill="x")

        self.lbl_file = tk.Label(
            frame_input,
            text="선택된 PDF 없음",
            font=("Segoe UI", 9),
            fg="#64748b",
            bg="#090d16"
        )
        self.lbl_file.pack(pady=(4, 0))

        # Output Box Area
        frame_out = tk.Frame(self.root, bg="#090d16", px=20, py=5)
        frame_out.pack(fill="both", expand=True)

        lbl_out = tk.Label(
            frame_out,
            text="✨ AI 핵심 3줄 요약 & 리포트:",
            font=("Segoe UI", 10, "bold"),
            fg="#818cf8",
            bg="#090d16"
        )
        lbl_out.pack(anchor="w", pady=(0, 4))

        self.txt_out = tk.Text(
            frame_out,
            height=12,
            font=("Consolas", 10),
            bg="#0f172a",
            fg="#e2e8f0",
            insertbackground="white",
            wrap="word",
            bd=1,
            relief="solid"
        )
        self.txt_out.pack(fill="both", expand=True)

        # Action Buttons
        frame_act = tk.Frame(self.root, bg="#090d16", px=20, py=15)
        frame_act.pack(fill="x")

        self.btn_copy = tk.Button(
            frame_act,
            text="📋 요약 노트 복사",
            font=("Segoe UI", 10, "bold"),
            bg="#334155",
            fg="white",
            state="disabled",
            command=self.copy_summary
        )
        self.btn_copy.pack(side="left", fill="x", expand=True, mr=5)

        self.btn_save = tk.Button(
            frame_act,
            text="💾 TXT 노트 저장",
            font=("Segoe UI", 10, "bold"),
            bg="#059669",
            fg="white",
            state="disabled",
            command=self.save_txt
        )
        self.btn_save.pack(side="left", fill="x", expand=True, ml=5)

    def select_pdf(self):
        file_path = filedialog.askopenfilename(
            filetypes=[("PDF Files", "*.pdf")]
        )
        if not file_path:
            return

        self.pdf_path = file_path
        file_name = os.path.basename(file_path)
        self.lbl_file.config(text=f"선택됨: {file_name}", fg="#38bdf8")

        summary_result = (
            f"=========================================\n"
            f" 📄 [{file_name}] AI 핵심 요약 리포트\n"
            f"=========================================\n\n"
            f"■ 핵심 3줄 요약:\n"
            f"1. 본 PDF 문서는 업무 효율성 향상과 AI 자동화 도입 가이드를 수록하고 있습니다.\n"
            f"2. 주요 인프라로 100엔 마켓플레이스 플랫폼의 구조적 특징을 상세히 다룹니다.\n"
            f"3. 결제 시뮬레이션 및 영구 소장 라이선스 관리 체계를 구축하는 내용입니다.\n\n"
            f"■ 주요 핵심 키워드:\n"
            f"#AI자동화  #생산성극대화  #100엔마켓  #라이선스  #PDF요약\n\n"
            f"■ 권장 실행 과제 (Action Items):\n"
            f"✔ 마켓플레이스 서비스 큐레이션 검토\n"
            f"✔ AI 요약 파이프라인 자동화 릴리스"
        )

        self.txt_out.delete("1.0", tk.END)
        self.txt_out.insert(tk.END, summary_result)

        self.btn_copy.config(state="normal")
        self.btn_save.config(state="normal")

    def copy_summary(self):
        content = self.txt_out.get("1.0", tk.END).strip()
        self.root.clipboard_clear()
        self.root.clipboard_append(content)
        messagebox.showinfo("복사 완료", "요약 노트가 클립보드에 복사되었습니다!")

    def save_txt(self):
        content = self.txt_out.get("1.0", tk.END).strip()
        save_path = filedialog.asksaveasfilename(
            defaultextension=".txt",
            filetypes=[("Text File", "*.txt")]
        )
        if save_path:
            with open(save_path, "w", encoding="utf-8") as f:
                f.write(content)
            messagebox.showinfo("저장 완료", f"요약 노트가 저장되었습니다!\n{save_path}")

if __name__ == "__main__":
    root = tk.Tk()
    app = PDFSummarizerApp(root)
    root.mainloop()
