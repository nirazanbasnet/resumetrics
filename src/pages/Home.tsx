import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"

export default function Home() {

    const getCurrentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="border-b">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="font-semibold text-xl">
                        ResuMetrics
                    </Link>
                    <Link to="/login" className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-8 shadow-md'>Login</Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Boost Your Career with Our Powerful Tools
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Access our advanced applications to enhance your job search and career development.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link to="/resume-score" className="h-10 px-8 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-blue-600 hover:bg-blue-700 text-white">
                                Try Resume Score
                            </Link>
                            <Link to="/job-matching-cv" className='h-10 px-8 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-white'>
                                Explore Job Matching CV
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* App Showcase */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Our Applications</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="flex flex-col">
                            <CardHeader>
                                <CardTitle>Resume Score</CardTitle>
                                <CardDescription>Optimize your resume for maximum impact</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        AI-powered resume analysis
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        Tailored improvement suggestions
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        Industry-specific keyword optimization
                                    </li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Link to="/resume-score" className="h-10 px-8 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-white text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 w-full bg-neutral-800">Launch Resume score</Link>
                            </CardFooter>
                        </Card>
                        <Card className="flex flex-col">
                            <CardHeader>
                                <CardTitle>Job Matching CV</CardTitle>
                                <CardDescription>Find the perfect job match for your skills</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        AI-driven job matching algorithm
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        Personalized job recommendations
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        Skill gap analysis and suggestions
                                    </li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Link to="/job-matching-cv" className="h-10 px-8 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-white text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 w-full bg-neutral-800">Launch Job Matching CV</Link>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Create Your Profile",
                                description: "Sign up and build your comprehensive career profile."
                            },
                            {
                                title: "Use Our Tools",
                                description: "Optimize your resume and find matching job opportunities."
                            },
                            {
                                title: "Boost Your Career",
                                description: "Apply with confidence and land your dream job."
                            }
                        ].map((step, index) => (
                            <Card key={index}>
                                <CardContent className="pt-6">
                                    <div className="text-4xl font-bold text-blue-600 mb-4">{index + 1}</div>
                                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                    <p className="text-gray-600">{step.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-blue-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Career?</h2>
                    <p className="text-xl mb-8">Start using our powerful tools today and take the next step in your professional journey.</p>
                    <Link to="/login" className='h-10 text-neutral-800 px-8 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-white'>
                        Get Started Now
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-gray-100 mt-auto">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="font-semibold mb-4">ResuMetrics</h3>
                            <p className="text-gray-600">Empowering your career journey with innovative tools and insights.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Products</h3>
                            <ul className="space-y-2">
                                <li><Link to="/resume-score" className="text-gray-600 hover:text-gray-900">Resume score</Link></li>
                                <li><Link to="/job-matching-cv" className="text-gray-600 hover:text-gray-900">Job Matching CV</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li><Link to="/privacy" className="text-gray-600 hover:text-gray-900">Privacy Policy</Link></li>
                                <li><Link to="/terms" className="text-gray-600 hover:text-gray-900">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
                        <p>&copy; {getCurrentYear} ResuMetrics. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}