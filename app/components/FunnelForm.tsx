"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Funnel } from "@/lib/types";

type FormData = Omit<Funnel, "id" | "createdAt" | "updatedAt">;
type ImageField = keyof Pick<
  FormData,
  | "adVideoImageUrl"
  | "adLpImageUrl"
  | "tpImageUrl"
  | "lineRegisterImageUrl"
  | "lineIconUrl"
  | "lineDeliveryImageUrl"
>;

interface Props {
  initialData?: Partial<FormData>;
  funnelId?: string;
}

// ── 外部コンポーネント: 画像アップロードブロック ─────────────────────────
interface ImageUploadBlockProps {
  field: ImageField;
  label: string;
  value: string;
  uploading: string | null;
  onUpload: (field: ImageField, file: File) => void;
  onClear: (field: ImageField) => void;
}

function ImageUploadBlock({
  field,
  label,
  value,
  uploading,
  onUpload,
  onClear,
}: ImageUploadBlockProps) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
      <div className="flex items-start gap-4">
        <div className="w-28 h-40 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center shrink-0">
          {value ? (
            <Image
              src={value}
              alt={label}
              width={112}
              height={160}
              className="w-full h-full object-cover object-top"
              unoptimized
            />
          ) : (
            <span className="text-gray-300 text-xs text-center px-1">画像なし</span>
          )}
        </div>
        <div className="flex flex-col gap-2 justify-center pt-2">
          <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            {uploading === field ? "アップロード中..." : "画像を選択"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && onUpload(field, e.target.files[0])
              }
              disabled={uploading !== null}
            />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onClear(field)}
              className="text-xs text-red-400 hover:text-red-600"
            >
              削除
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── 外部コンポーネント: テキストエリアブロック ───────────────────────────
interface TextareaBlockProps {
  label: string;
  hint?: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

function TextareaBlock({
  label,
  hint,
  value,
  placeholder,
  onChange,
}: TextareaBlockProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
    </div>
  );
}

// ── メインフォーム ────────────────────────────────────────────────────────
export default function FunnelForm({ initialData, funnelId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    name: initialData?.name ?? "",
    adVideoImageUrl: initialData?.adVideoImageUrl ?? "",
    adVideoUrls: initialData?.adVideoUrls ?? [],
    adCtas: initialData?.adCtas ?? [],
    adLpImageUrl: initialData?.adLpImageUrl ?? "",
    adLpLinks: initialData?.adLpLinks ?? [],
    tpImageUrl: initialData?.tpImageUrl ?? "",
    tpLinks: initialData?.tpLinks ?? [],
    lineRegisterImageUrl: initialData?.lineRegisterImageUrl ?? "",
    lineIconUrl: initialData?.lineIconUrl ?? "",
    lineDeliveryImageUrl: initialData?.lineDeliveryImageUrl ?? "",
    distributionUrls: initialData?.distributionUrls ?? [],
  });
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleImageUpload(field: ImageField, file: File) {
    setUploading(field);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setForm((prev) => ({ ...prev, [field]: data.url }));
    setUploading(null);
  }

  function handleClearImage(field: ImageField) {
    setForm((prev) => ({ ...prev, [field]: "" }));
  }

  function handleUrls(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value.split("\n") }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("導線名を入力してください");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      adCtas: (form.adCtas ?? []).filter((u) => u.trim()),
      adVideoUrls: (form.adVideoUrls ?? []).filter((u) => u.trim()),
      adLpLinks: (form.adLpLinks ?? []).filter((u) => u.trim()),
      tpLinks: (form.tpLinks ?? []).filter((u) => u.trim()),
      distributionUrls: (form.distributionUrls ?? []).filter((u) => u.trim()),
    };
    if (funnelId) {
      await fetch(`/api/funnels/${funnelId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/funnels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    router.push("/");
    router.refresh();
  }

  // 共通propsをまとめる
  const uploadProps = {
    uploading,
    onUpload: handleImageUpload,
    onClear: handleClearImage,
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-6 py-8">
      {/* ヘッダー */}
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          ← 戻る
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {funnelId ? "導線を編集" : "導線を追加"}
        </h1>
      </div>

      <div className="flex flex-col gap-4">
        {/* 導線名 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            導線名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="例：YouTube広告〜LINE登録ルート"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* STEP 1: 広告動画 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-blue-50">
            <span className="bg-blue-500 text-white text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center shrink-0">
              1
            </span>
            <h2 className="font-bold text-gray-800">広告動画</h2>
          </div>
          <div className="p-6 flex flex-col gap-5">
            <ImageUploadBlock
              field="adVideoImageUrl"
              label="サムネイル画像"
              value={form.adVideoImageUrl ?? ""}
              {...uploadProps}
            />
            <TextareaBlock
              label="動画URL"
              hint="1行に1つ入力してください"
              value={(form.adVideoUrls ?? []).join("\n")}
              placeholder={"https://動画URL1\nhttps://動画URL2"}
              onChange={(v) => handleUrls("adVideoUrls", v)}
            />
            <TextareaBlock
              label="CTA（ボタンテキスト）"
              hint="1行に1つ入力してください"
              value={(form.adCtas ?? []).join("\n")}
              placeholder={"今すぐ無料登録\n詳しくはこちら"}
              onChange={(v) => handleUrls("adCtas", v)}
            />
          </div>
        </div>

        {/* STEP 2: ランディングページ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-purple-50">
            <span className="bg-purple-500 text-white text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center shrink-0">
              2
            </span>
            <h2 className="font-bold text-gray-800">ランディングページ（LP）</h2>
          </div>
          <div className="p-6 flex flex-col gap-5">
            <ImageUploadBlock
              field="adLpImageUrl"
              label="ファーストビュー画像"
              value={form.adLpImageUrl ?? ""}
              {...uploadProps}
            />
            <TextareaBlock
              label="LPリンク"
              hint="1行に1つ入力してください"
              value={(form.adLpLinks ?? []).join("\n")}
              placeholder={"https://LP-URL1\nhttps://LP-URL2"}
              onChange={(v) => handleUrls("adLpLinks", v)}
            />
          </div>
        </div>

        {/* STEP 3: サンクスページ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-orange-50">
            <span className="bg-orange-500 text-white text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center shrink-0">
              3
            </span>
            <h2 className="font-bold text-gray-800">サンクスページ（TP）</h2>
          </div>
          <div className="p-6 flex flex-col gap-5">
            <ImageUploadBlock
              field="tpImageUrl"
              label="ファーストビュー画像"
              value={form.tpImageUrl ?? ""}
              {...uploadProps}
            />
            <TextareaBlock
              label="TPリンク"
              hint="1行に1つ入力してください"
              value={(form.tpLinks ?? []).join("\n")}
              placeholder={"https://TP-URL1\nhttps://TP-URL2"}
              onChange={(v) => handleUrls("tpLinks", v)}
            />
          </div>
        </div>

        {/* STEP 4: LINE登録 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-green-50">
            <span className="bg-green-500 text-white text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center shrink-0">
              4
            </span>
            <h2 className="font-bold text-gray-800">LINE登録</h2>
          </div>
          <div className="p-6 flex flex-col gap-5">
            <ImageUploadBlock
              field="lineRegisterImageUrl"
              label="LINE登録ページのファーストビュー画像"
              value={form.lineRegisterImageUrl ?? ""}
              {...uploadProps}
            />
            <ImageUploadBlock
              field="lineIconUrl"
              label="LINEアカウントのアイコン画像"
              value={form.lineIconUrl ?? ""}
              {...uploadProps}
            />
          </div>
        </div>

        {/* STEP 5: LINE配信 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-emerald-50">
            <span className="bg-emerald-500 text-white text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center shrink-0">
              5
            </span>
            <h2 className="font-bold text-gray-800">LINE配信（1通目）</h2>
          </div>
          <div className="p-6">
            <ImageUploadBlock
              field="lineDeliveryImageUrl"
              label="LINE配信のスクリーンショット"
              value={form.lineDeliveryImageUrl ?? ""}
              {...uploadProps}
            />
          </div>
        </div>

        {/* STEP 6: 特典・配布資料 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-pink-50">
            <span className="bg-pink-500 text-white text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center shrink-0">
              6
            </span>
            <h2 className="font-bold text-gray-800">特典・配布資料</h2>
          </div>
          <div className="p-6">
            <TextareaBlock
              label="配布PDF・動画URL"
              hint="1行に1つ入力してください"
              value={(form.distributionUrls ?? []).join("\n")}
              placeholder={"https://PDF-URL1\nhttps://動画URL2"}
              onChange={(v) => handleUrls("distributionUrls", v)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          {saving ? "保存中..." : funnelId ? "更新する" : "追加する"}
        </button>
      </div>
    </form>
  );
}
