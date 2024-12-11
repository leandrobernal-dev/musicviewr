"use client";

import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Upload, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/NumberInput";

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

export default function SheetMusicViewer() {
    const [pdfFile, setPdfFile] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [tempo, setTempo] = useState(120);
    const [scrollSpeed, setScrollSpeed] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const metronomeIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Handle file upload
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === "application/pdf") {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPdfFile(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle document load success
    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setCurrentPage(1);
    };

    // Metronome functionality
    useEffect(() => {
        audioContextRef.current = new AudioContext();

        return () => {
            audioContextRef.current?.close();
            if (metronomeIntervalRef.current) {
                clearInterval(metronomeIntervalRef.current);
            }
        };
    }, []);

    const playMetronome = () => {
        if (!audioContextRef.current || isMuted) return;

        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        oscillator.frequency.value = 880;
        gainNode.gain.value = 0.5;

        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(
            0.00001,
            audioContextRef.current.currentTime + 0.1
        );

        setTimeout(() => oscillator.stop(), 100);
    };

    // Auto-scroll functionality with improved scrolling
    useEffect(() => {
        if (isPlaying && containerRef.current) {
            const scrollInterval = setInterval(() => {
                containerRef.current?.scrollBy({
                    top: scrollSpeed * 2, // Multiply by 2 to make scrolling more noticeable
                    behavior: "auto", // Changed to 'auto' for smoother continuous scrolling
                });
            }, 16); // Using requestAnimationFrame rate (approximately 60fps)

            return () => clearInterval(scrollInterval);
        }
    }, [isPlaying, scrollSpeed]);

    // Metronome interval
    useEffect(() => {
        if (isPlaying) {
            const interval = 60000 / tempo; // Calculate interval in milliseconds
            metronomeIntervalRef.current = setInterval(playMetronome, interval);

            return () => {
                if (metronomeIntervalRef.current) {
                    clearInterval(metronomeIntervalRef.current);
                }
            };
        }
    }, [isPlaying, tempo, isMuted]);

    return (
        <div className="h-screen bg-[#06141B] text-[#CCD0CF] flex flex-col  ">
            {/* Sticky Navbar */}
            <nav className="sticky top-0 z-50 justify-center bg-[#11212D] border-b border-[#253745] p-4 flex items-center gap-16">
                <div className="flex items-center gap-4">
                    <NumberInput
                        value={tempo}
                        onChange={setTempo}
                        min={40}
                        max={208}
                        step={1}
                        label="BPM"
                    />
                    <NumberInput
                        value={scrollSpeed}
                        onChange={setScrollSpeed}
                        min={0}
                        max={10}
                        step={0.1}
                        label="Scroll"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => setIsMuted(!isMuted)}
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8"
                    >
                        {isMuted ? (
                            <VolumeX className="w-4 h-4" />
                        ) : (
                            <Volume2 className="w-4 h-4" />
                        )}
                    </Button>
                    <Button
                        onClick={() => setIsPlaying(!isPlaying)}
                        size="icon"
                        className="bg-[#253745] hover:bg-[#4A5C6A] w-8 h-8"
                    >
                        {isPlaying ? (
                            <Pause className="w-4 h-4" />
                        ) : (
                            <Play className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </nav>

            <div
                ref={containerRef}
                className="flex-1 h-full items-center flex justify-center overflow-y-auto"
            >
                {!pdfFile ? (
                    <div className="h-full flex items-center justify-center ">
                        <div className="text-center space-y-4">
                            <div className="p-8 border-2 border-dashed border-[#253745] rounded-lg">
                                <Label
                                    htmlFor="pdf-upload"
                                    className="flex flex-col items-center gap-2 cursor-pointer"
                                >
                                    <Upload className="w-8 h-8" />
                                    <span className="text-lg font-medium">
                                        Upload Sheet Music (PDF)
                                    </span>
                                    <span className="text-sm text-[#9BA8AB]">
                                        Click to browse or drag and drop
                                    </span>
                                </Label>
                                <Input
                                    id="pdf-upload"
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full">
                        <Document
                            file={pdfFile}
                            onLoadSuccess={onDocumentLoadSuccess}
                            className="flex flex-col items-center"
                        >
                            {Array.from(new Array(numPages), (el, index) => (
                                <Page
                                    key={`page_${index + 1}`}
                                    pageNumber={index + 1}
                                    className="mb-4"
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                />
                            ))}
                        </Document>
                    </div>
                )}
            </div>
        </div>
    );
}
