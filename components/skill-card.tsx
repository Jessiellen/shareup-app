"use client"

import { Button } from "@/components/ui/button"

interface SkillPost {
  id: number
  title: string
  description: string
  image: string
  category: string
  author: string
  readTime: string
}

interface SkillCardProps {
  post: SkillPost
  featured?: boolean
}

export default function SkillCard({ post, featured = false }: SkillCardProps) {
  if (featured) {
    return (
      <div className="relative bg-gradient-to-r from-shareup-dark to-shareup-dark/90 rounded-2xl overflow-hidden min-h-[400px]">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>

        <div className="absolute right-0 top-0 w-1/2 h-full">
          <div className="w-full h-full bg-shareup-lime/20 rounded-l-3xl flex items-center justify-center">
            <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-6xl">🎵</span>
            </div>
          </div>
        </div>

        <div className="relative z-20 p-8 h-full flex flex-col justify-center max-w-2xl">
          <div className="mb-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              <span className="text-shareup-cyan">"STUDIES</span>
              <br />
              <span className="text-shareup-cyan">SHOW</span>
              <br />
              <span className="text-shareup-cyan">LEARNING</span>
              <br />
              <span className="text-shareup-cyan">TO PLAY AN</span>
              <br />
              <span className="text-shareup-cyan">INSTRUM</span>
              <br />
              <span className="text-shareup-cyan">ENT</span>
              <br />
              <span className="text-shareup-cyan">BOOSTS</span>
              <br />
              <span className="text-shareup-cyan">EMOTIONAL</span>
              <br />
              <span className="text-shareup-cyan">INTELLIGE</span>
              <br />
              <span className="text-shareup-cyan">NCE AND</span>
              <br />
              <span className="text-shareup-cyan">LONG-TERM</span>
              <br />
              <span className="text-shareup-cyan">MEMORY"</span>
            </h2>
          </div>

          <p className="text-slate-300 mb-6 max-w-md leading-relaxed">{post.description}</p>

          <Button className="bg-transparent border-2 border-shareup-cyan text-shareup-cyan hover:bg-shareup-cyan hover:text-shareup-dark w-fit px-6">
            MORE →
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-shareup-dark/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-shareup-cyan/50 transition-all duration-300">
      <div className="h-48 bg-gradient-to-r from-shareup-cyan/20 to-shareup-lime/20 flex items-center justify-center">
        <span className="text-4xl">🎨</span>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-shareup-cyan bg-shareup-cyan/10 px-2 py-1 rounded">
            {post.category}
          </span>
          <span className="text-xs text-slate-400">{post.readTime}</span>
        </div>

        <h3 className="font-semibold mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-3">{post.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">by {post.author}</span>
          <Button size="sm" className="bg-shareup-cyan hover:bg-shareup-cyan/90 text-shareup-dark">
            Read More
          </Button>
        </div>
      </div>
    </div>
  )
}
