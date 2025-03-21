import Button from '@/app/ui/button'
import { ArrowRightIcon } from 'lucide-react'
import Image from 'next/image.js'
import Link from 'next/link'

export default function LoginPage(){
    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <Image 
                       className="w-8 h-8 mr-2" 
                       width={500}
                       height={500}
                       src="/logo-gna.jpg" alt="logo"
                    />
                    SUPPER RESTAURANT    
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            S'inscrire
                        </h1>
                        <form className="space-y-4 md:space-y-6" action="#">
                            <div>
                                <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="leprogrammeur@gna-ci.com"/>
                            </div>
                            <div>
                                <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mot de passe</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mot de passe de confirmation</label>
                                <input type="confirm-password" name="confirm-password" id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                            </div>
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"/>
                                </div>
                                <div className="ml-3 text-sm">
                                    <label className="font-light text-gray-500 dark:text-gray-300">J'accèpte <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">les termes et conditions</a></label>
                                </div>
                            </div>
                            <Button className="w-full text-white bg-primary-800 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                Se connecter <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-500"/>
                            </Button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Avez-vous un compte ? <Link className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="/signup">Se connecter</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}