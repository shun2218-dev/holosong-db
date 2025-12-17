import { db } from "@/db";
import { talents } from "@/db/schema";
import Image from "next/image";
import Link from "next/link";

export default async function TalentsPage() {
  const allTalents = await db.select().from(talents);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Talents</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allTalents.map((talent) => (
          <Link 
            href={`/talents/${talent.id}`} 
            key={talent.id}
            className="flex flex-col items-center bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            {/* タレントアイコン */}
            <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
              {talent.imageUrl ? (
                <Image 
                  src={talent.imageUrl} 
                  alt={talent.name} 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-2xl">?</div>
              )}
            </div>
            
            <h2 className="font-bold text-lg text-gray-900">{talent.name}</h2>
            <p className="text-sm text-gray-500">{talent.generation}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}