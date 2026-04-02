"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Funnel } from "@/lib/types";

// ── カラー定義 ──────────────────────────────────────────────────────────────
type ColorKey = "blue" | "purple" | "orange" | "green" | "emerald" | "pink";

const COLORS: Record<
  ColorKey,
  { bg: string; border: string; badge: string; link: string; sideBg: string }
> = {
  blue:    { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-500", link: "text-blue-600", sideBg: "bg-blue-50" },
  purple:  { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-500", link: "text-blue-600", sideBg: "bg-blue-50" },
  orange:  { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-500", link: "text-blue-600", sideBg: "bg-blue-50" },
  green:   { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-500", link: "text-blue-600", sideBg: "bg-blue-50" },
  emerald: { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-500", link: "text-blue-600", sideBg: "bg-blue-50" },
  pink:    { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-500", link: "text-blue-600", sideBg: "bg-blue-50" },
};

// ── 下向き矢印 ──────────────────────────────────────────────────────────────
function DownArrow() {
  return (
    <div className="flex justify-center items-center h-8 shrink-0">
      <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
        <path d="M10 2 L10 22" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M3 16 L10 25 L17 16" stroke="#CBD5E1" strokeWidth="2.5" fill="none"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ── 縦並びステップカード ─────────────────────────────────────────────────────
interface VerticalStepCardProps {
  step: number;
  label: string;
  color: ColorKey;
  imageUrl?: string;
  isVideo?: boolean;
  videoUrls?: string[];
  ctaTexts?: string[];
  links?: string[];
  linkLabel?: string;
  extra?: React.ReactNode;
}

function VerticalStepCard({
  step,
  label,
  color,
  imageUrl,
  isVideo,
  videoUrls,
  ctaTexts,
  links,
  linkLabel = "リンク",
  extra,
}: VerticalStepCardProps) {
  const c = COLORS[color];
  const validVideoUrls = (videoUrls ?? []).filter(Boolean);
  const validCtas = (ctaTexts ?? []).filter(Boolean);
  const validLinks = (links ?? []).filter(Boolean);

  const imageNode = imageUrl ? (
    <Image
      src={imageUrl}
      alt={label}
      width={220}
      height={280}
      className="w-full h-full object-cover object-top"
      unoptimized
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center">
      <span className="text-3xl opacity-20">{isVideo ? "🎬" : "🖼️"}</span>
    </div>
  );

  return (
    <div
      className={`rounded-xl border-2 ${c.border} flex flex-row overflow-hidden shadow-sm bg-white h-[280px]`}
    >
      {/* 左: ステップバッジ＋ラベル */}
      <div
        className={`${c.sideBg} flex flex-col items-center justify-center px-6 gap-3 border-r ${c.border} w-[140px] shrink-0`}
      >
        <span
          className={`${c.badge} text-white text-xl font-bold w-14 h-14 rounded-full flex items-center justify-center shrink-0`}
        >
          {step}
        </span>
        <span className="text-base font-bold text-gray-600 text-center leading-snug">
          {label}
        </span>
      </div>

      {/* 中: 画像 */}
      <div className="w-[220px] h-[280px] shrink-0 bg-gray-50 border-r border-gray-100 overflow-hidden">
        {isVideo && validVideoUrls.length > 0 ? (
          <a
            href={validVideoUrls[0]}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full"
            title="クリックして動画を開く"
          >
            {imageNode}
          </a>
        ) : (
          imageNode
        )}
      </div>

      {/* 右: コンテンツ */}
      <div className="flex-1 px-8 py-6 flex flex-col justify-center items-center text-center gap-3 overflow-y-auto">
        {/* 動画リンク（複数の場合のみ表示） */}
        {isVideo && validVideoUrls.length > 1 &&
          validVideoUrls.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-lg ${c.link} hover:underline truncate`}
            >
              動画{i + 1} ▶
            </a>
          ))}
        {isVideo && validVideoUrls.length === 1 && (
          <a
            href={validVideoUrls[0]}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm ${c.link} hover:underline truncate`}
          >
            動画を見る ▶
          </a>
        )}
        {/* CTAテキスト */}
        {validCtas.length > 0 && (
          <div className={`${c.bg} rounded-lg border ${c.border} px-3 py-1.5 inline-block`}>
            {validCtas.map((text, i) => (
              <p key={i} className="text-lg font-medium text-gray-800 leading-snug">
                {text}
              </p>
            ))}
          </div>
        )}
        {/* 通常リンク */}
        {!isVideo &&
          validLinks.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-lg ${c.link} hover:underline truncate`}
            >
              {linkLabel}{validLinks.length > 1 ? i + 1 : ""} →
            </a>
          ))}
        {/* 画像未登録かつリンクもなし */}
        {!imageUrl && validVideoUrls.length === 0 && validLinks.length === 0 && validCtas.length === 0 && !extra && (
          <span className="text-lg text-gray-300">未登録</span>
        )}
        {extra}
      </div>
    </div>
  );
}

// ── メインページ ─────────────────────────────────────────────────────────────
export default function Home() {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/funnels")
      .then((r) => r.json())
      .then((data: Funnel[]) => {
        setFunnels(data);
        if (data.length > 0) setSelectedId(data[0].id);
        setLoading(false);
      });
  }, []);

  async function deleteFunnel(id: string, name: string) {
    if (!confirm(`「${name}」を削除しますか？`)) return;
    await fetch(`/api/funnels/${id}`, { method: "DELETE" });
    setFunnels((prev) => {
      const next = prev.filter((f) => f.id !== id);
      setSelectedId(next.length > 0 ? next[0].id : null);
      return next;
    });
  }

  const selected = funnels.find((f) => f.id === selectedId) ?? null;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ── 左サイドバー ── */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col shrink-0">
        {/* サイドバーヘッダー */}
        <div className="px-5 py-6 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-900">導線マネージャー</h1>
          <p className="text-sm text-gray-400 mt-1">マーケティング導線一覧</p>
        </div>

        {/* 導線リスト */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {loading && (
            <p className="text-sm text-gray-400 text-center py-4">読み込み中...</p>
          )}
          {!loading && funnels.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">導線がありません</p>
          )}
          {funnels.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedId(f.id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium mb-1.5 transition-colors flex items-center gap-3 ${
                selectedId === f.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {f.lineIconUrl && (
                <Image
                  src={f.lineIconUrl}
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full object-cover shrink-0"
                  unoptimized
                />
              )}
              <span className="truncate">{f.name}</span>
            </button>
          ))}
        </nav>

        {/* 追加ボタン */}
        <div className="p-4 border-t border-gray-100">
          <Link
            href="/funnels/new"
            className="flex items-center justify-center gap-1 w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 rounded-xl transition-colors"
          >
            ＋ 導線を追加
          </Link>
        </div>
      </aside>

      {/* ── 右コンテンツエリア ── */}
      <main className="flex-1 overflow-y-auto">
        {/* 未選択 */}
        {!loading && !selected && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">左のメニューから導線を選択してください</p>
          </div>
        )}

        {selected && (
          <div className="max-w-4xl mx-auto px-10 py-8">
            {/* 導線ヘッダー */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                {selected.lineIconUrl && (
                  <Image
                    src={selected.lineIconUrl}
                    alt="LINEアイコン"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    unoptimized
                  />
                )}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{selected.name}</h2>
                  <p className="text-base text-gray-400 mt-1">マーケティング導線フロー</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/funnels/${selected.id}/edit`}
                  className="text-lg text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400 px-6 py-2.5 rounded-xl transition-colors font-medium"
                >
                  編集
                </Link>
                <button
                  onClick={() => deleteFunnel(selected.id, selected.name)}
                  className="text-lg text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-6 py-2.5 rounded-xl transition-colors font-medium"
                >
                  削除
                </button>
              </div>
            </div>

            {/* 縦フロー */}
            <div className="flex flex-col">
              {/* STEP 1: 広告動画 */}
              <VerticalStepCard
                step={1} label="広告動画" color="blue"
                imageUrl={selected.adVideoImageUrl}
                isVideo
                videoUrls={selected.adVideoUrls}
                ctaTexts={selected.adCtas}
              />
              <DownArrow />

              {/* STEP 2: ランディングページ */}
              <VerticalStepCard
                step={2} label="LP（メール入力）" color="purple"
                imageUrl={selected.adLpImageUrl}
                links={selected.adLpLinks} linkLabel="LP"
              />
              <DownArrow />

              {/* STEP 3: サンクスページ */}
              <VerticalStepCard
                step={3} label="サンクスページ" color="orange"
                imageUrl={selected.tpImageUrl}
                links={selected.tpLinks} linkLabel="TP"
              />
              <DownArrow />

              {/* STEP 4: LINE登録 */}
              <VerticalStepCard
                step={4} label="LINE登録" color="green"
                imageUrl={selected.lineRegisterImageUrl}
                extra={
                  selected.lineIconUrl ? (
                    <div className="flex items-center gap-1.5 pt-1 border-t border-green-100 mt-1">
                      <Image
                        src={selected.lineIconUrl}
                        alt="LINE"
                        width={18}
                        height={18}
                        className="w-4 h-4 rounded-full border border-gray-200 shrink-0"
                        unoptimized
                      />
                      <span className="text-xs text-gray-500">LINEアカウント</span>
                    </div>
                  ) : undefined
                }
              />
              <DownArrow />

              {/* STEP 5: LINE配信 */}
              <VerticalStepCard
                step={5} label="LINE配信1通目" color="emerald"
                imageUrl={selected.lineDeliveryImageUrl}
              />

              {/* STEP 6: 特典（任意） */}
              {(selected.distributionUrls ?? []).some(Boolean) && (
                <>
                  <DownArrow />
                  <VerticalStepCard
                    step={6} label="特典・配布資料" color="pink"
                    links={selected.distributionUrls} linkLabel="資料"
                  />
                </>
              )}

              <div className="h-10" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
