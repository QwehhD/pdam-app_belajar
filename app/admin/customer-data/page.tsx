import { getCookie } from "@/lib/server-cookies";
import { Customer } from "@/app/types";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // Asumsi pakai Shadcn
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import getCustomer from "./get";
import { PlusCircle, User, MapPin, Phone } from "lucide-react"; // Icon biar manis

export default async function ServicesPage() {
    const customer: Customer[] = await getCustomer();

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Daftar Customer</h1>
                    <p className="text-muted-foreground">Kelola informasi pelanggan Anda di sini.</p>
                </div>
                
                {/* Tombol Tambah Customer */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Tambah Customer
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tambah Customer Baru</DialogTitle>
                        </DialogHeader>
                        {/* <AddService /> */}
                        <div className="p-4 text-center text-sm text-gray-500 italic">
                            Form tambah data di sini...
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {customer.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-12 text-center">
                    <p className="text-lg font-medium">Data Customer Tidak Ada</p>
                    <p className="text-sm text-muted-foreground">Mulai tambahkan customer pertama Anda hari ini.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {customer.map((item) => (
                        <Card key={item.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <CardTitle className="text-xl">{item.user.username}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center text-muted-foreground">
                                        <Phone className="mr-2 h-4 w-4" />
                                        {item.phone}
                                    </div>
                                    <div className="flex items-start text-muted-foreground">
                                        <MapPin className="mr-2 h-4 w-4 mt-0.5" />
                                        <span className="leading-relaxed">{item.address}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}