<div>
	<div class="lg:w-96 w-full max-w-sm pb-16 mt-16 mb-auto">
      <h1 class="font-heading text-navy inline-flex items-start mb-5 text-3xl">
        Reset Your&nbsp;Password
      </h1>
      <p class="mb-7 block text-base text-gray-500">
        Enter the email associated with your account and we’ll send you password reset instructions.
      </p>
      <form action="/app/password_resets" method="post">


    <input name="_csrf_token" type="hidden" hidden="" value="KxkVAQ0wBy8BQVQkYCEqIRowBTc8dCJdfngDtzWIB5aM5SPlSGBUv-I3">


<input id="password_return_to" name="password[return_to]" type="hidden">
<label class="text-navy block text-sm font-medium" for="password_email">
          Your Email <input autocapitalize="off" autocorrect="off" autofocus="" class="mb-6 mt-1.5 transition appearance-none block w-full px-3 py-3 rounded-lg shadow-sm border border-[#D7DFE9] hover:border-violet-200 focus:border-violet-300 bg-violet-50 bg-opacity-0 hover:bg-opacity-50 focus:bg-opacity-50 ring-violet-200 focus:ring-violet-200 focus:ring-[3px] focus:outline-none" data-message="Please enter a valid email address." id="password_email" name="password[email]" pattern="[^@]+@[^@]+.[a-zA-Z]{1,}" required="" spellcheck="false" type="email">
          <span></span>
</label>
<button class="transition w-full flex justify-center py-3.5 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-[3px] ring-violet-200 ring-offset-1 focus:ring-violet-200" type="submit">Send Reset Instructions</button>

</form>
      <a href="/app/sign-in" class="text-violet-500 hover:text-violet-700 inline-flex mt-6 text-sm font-medium transition-colors">
        Return to Sign In
      </a>
    </div>
</div>
