console.log('content script loaded')


// Listen for click on the trend element 
document.addEventListener("click", function(event) {
	const div = event.composedPath().filter(path => path.className == "css-1dbjc4n r-1adg3ll r-1ny4l3l")
	if (div.length > 0 && window.location.href.includes("twitter.com/search")) {
		let trendName = div[0].children[0].children[0].children[0].children[1].innerText
		trendName = trendName.replace("#", "")
		console.log(trendName)

		// add the loading... message when page loads
		let loading = setInterval(() => {
			if (document.querySelector('[data-testid="cellInnerDiv"]') != null) {
				displayMessage("Loading...");
				clearInterval(loading);
			}
		}, 500)

		fetch(`https://twitter-flask-372723.ue.r.appspot.com/articles?tag=${trendName}`)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);

			// make sure the page is loaded before adding the div
			let display = setInterval(() => {
				if (document.querySelector('[data-testid="cellInnerDiv"]') != null) {
					remove()
					if (data[0].summary != "") {
						displayTLDR(data[0].summary, data[0].source, data[0].source_link, data[1].google_news_link);
					} else {
						displayMessage("Sorry, we could not generate a summary for "+trendName);
					}
					clearInterval(display);
				}
			}, 500)
			
		}).catch((err) => {
			console.log(err)
		});
	}
});

function displayTLDR(summary, source, source_link, google_link) {
	// create a div and add it to the page
	var div = document.createElement("div");
	div.id = "twildr"
	div.style = "position: relative; width: 100%; transition: opacity 0.3s ease-out 0s;"

	div.innerHTML = 
	`
	<div class="css-1dbjc4n r-1igl3o0 r-qklmqi r-1adg3ll r-1ny4l3l">
	<div class="css-1dbjc4n">
		<div class="css-1dbjc4n">
			<article aria-labelledby="id__if2772f7jhf id__uukss43jqwf id__djyr3k7l4vl id__3l9gr9ydh3n id__70yn8ck23rt id__ggg5n7v2e7j id__8qxglqrztmg id__v7ttdz78ylf id__80hxzl0fk5n id__iqzem58zp5 id__joz34qhhb7 id__b59tw0te9bk id__kh2cr2373k id__0g4uni1v84c id__sh5ofnjsxx id__c7umvsnh487 id__7bf6w9qkl id__5z0rvpuaeet id__gyg1htlrmcw" role="article" tabindex="0" class="css-1dbjc4n r-1loqt21 r-18u37iz r-1ny4l3l r-1udh08x r-1qhn6m8 r-i023vh r-o7ynqc r-6416eg" data-testid="tweet">
				<div class="css-1dbjc4n r-eqz5dr r-16y2uox r-1wbh5a2">
					<div class="css-1dbjc4n r-16y2uox r-1wbh5a2 r-1ny4l3l">
						<div class="css-1dbjc4n">
							<div class="css-1dbjc4n">
								<div class="css-1dbjc4n r-18u37iz">
									<div class="css-1dbjc4n r-1iusvr4 r-16y2uox r-ttdzmv"></div>
								</div>
							</div>
							<div class="css-1dbjc4n r-18u37iz">
								<div class="css-1dbjc4n r-1awozwy r-1hwvwag r-18kxxzh r-1b7u577">
									<div class="css-1dbjc4n" data-testid="Tweet-User-Avatar">
										<div class="css-1dbjc4n r-18kxxzh r-1wbh5a2 r-13qz1uu">
											<div class="css-1dbjc4n r-1wbh5a2 r-dnmrzs">
												<div class="css-1dbjc4n r-1adg3ll r-bztko3" data-testid="UserAvatar-Container-TheLondonHughes" style="height: 48px; width: 48px;">
													<div class="r-1adg3ll r-13qz1uu" style="padding-bottom: 100%;"></div>
													<div class="r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-ipm5af r-13qz1uu">
														<div class="css-1dbjc4n r-1adg3ll r-1pi2tsx r-1wyvozj r-bztko3 r-u8s1d r-1v2oles r-desppf r-13qz1uu">
															<div class="r-1adg3ll r-13qz1uu" style="padding-bottom: 100%;"></div>
															<div class="r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-ipm5af r-13qz1uu">
																<div class="css-1dbjc4n r-sdzlij r-ggadg3 r-1udh08x r-u8s1d r-8jfcpp" style="height: calc(100% - -4px); width: calc(100% - -4px);">
																	<a href="/twildr_" aria-hidden="true" role="link" tabindex="-1" class="css-4rbku5 css-18t94o4 css-1dbjc4n r-1niwhzg r-1loqt21 r-1pi2tsx r-1ny4l3l r-o7ynqc r-6416eg r-13qz1uu">
																		<div class="css-1dbjc4n r-sdzlij r-1wyvozj r-1udh08x r-633pao r-u8s1d r-1v2oles r-desppf" style="height: calc(100% - 4px); width: calc(100% - 4px);">
																			<div class="css-1dbjc4n r-1niwhzg r-1pi2tsx r-13qz1uu"></div>
																		</div>
																		<div class="css-1dbjc4n r-sdzlij r-1wyvozj r-1udh08x r-633pao r-u8s1d r-1v2oles r-desppf" style="height: calc(100% - 4px); width: calc(100% - 4px);">
																			<div class="css-1dbjc4n r-kemksi r-1pi2tsx r-13qz1uu"></div>
																		</div>
																		<div class="css-1dbjc4n r-kemksi r-sdzlij r-1wyvozj r-1udh08x r-633pao r-u8s1d r-1v2oles r-desppf" style="height: calc(100% - 4px); width: calc(100% - 4px);">
																			<div class="css-1dbjc4n r-1adg3ll r-1udh08x" style="">
																				<div class="r-1adg3ll r-13qz1uu" style="padding-bottom: 100%;"></div>
																				<div class="r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-ipm5af r-13qz1uu">
																					<div aria-label="" class="css-1dbjc4n r-1p0dtai r-1mlwlqe r-1d2f490 r-1udh08x r-u8s1d r-zchlnj r-ipm5af r-417010">
																						<div class="css-1dbjc4n r-1niwhzg r-vvn4in r-u6sd8q r-4gszlv r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw" style="background-image: url(&quot;https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg&quot;);"></div>
																						<img alt="" draggable="true" src="https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg" class="css-9pa8cd">
																					</div>
																				</div>
																			</div>
																		</div>
																		<div class="css-1dbjc4n r-sdzlij r-1wyvozj r-1udh08x r-u8s1d r-1v2oles r-desppf" style="height: calc(100% - 4px); width: calc(100% - 4px);">
																			<div class="css-1dbjc4n r-172uzmj r-1pi2tsx r-1ny4l3l r-o7ynqc r-6416eg r-13qz1uu"></div>
																		</div>
																	</a>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="css-1dbjc4n r-1iusvr4 r-16y2uox r-1777fci r-kzbkwu">
									<div class="css-1dbjc4n">
										<div class="css-1dbjc4n r-zl2h9q">
											<div class="css-1dbjc4n r-k4xj1c r-18u37iz r-1wtj0ep">
												<div class="css-1dbjc4n r-1d09ksm r-18u37iz r-1wbh5a2">
													<div class="css-1dbjc4n r-1wbh5a2 r-dnmrzs r-1ny4l3l">
														<div class="css-1dbjc4n r-1awozwy r-18u37iz r-1wbh5a2 r-dnmrzs r-1ny4l3l" id="id__70yn8ck23rt" data-testid="User-Names">
															<div class="css-1dbjc4n r-1awozwy r-18u37iz r-1wbh5a2 r-dnmrzs">
																<div class="css-1dbjc4n r-1wbh5a2 r-dnmrzs">
																	<a href="/twildr_" role="link" class="css-4rbku5 css-18t94o4 css-1dbjc4n r-1loqt21 r-1wbh5a2 r-dnmrzs r-1ny4l3l">
																		<div class="css-1dbjc4n r-1awozwy r-18u37iz r-1wbh5a2 r-dnmrzs">
																			<div dir="ltr" class="css-901oao r-1awozwy r-1nao33i r-6koalj r-37j5jr r-a023e6 r-b88u0q r-rjixqe r-bcqeeo r-1udh08x r-3s2u2q r-qvutc0"><span class="css-901oao css-16my406 css-1hf3ou5 r-poiln3 r-bcqeeo r-qvutc0">
																				<span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">TwiLDR</span>
																				</span>
																			</div>
																			<div dir="ltr" class="css-901oao r-1nao33i r-xoduu5 r-18u37iz r-1q142lx r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0">
																				<svg viewBox="0 0 24 24" aria-label="Verified account" role="img" class="r-1cvl2hr r-4qtqp9 r-yyyyoo r-1xvli5t r-9cviqr r-f9ja8p r-og9te1 r-bnwqim r-1plcrui r-lrvibr" data-testid="icon-verified">
																					<g>
																						<path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"></path>
																					</g>
																				</svg>
																			</div>
																		</div>
																	</a>
																</div>
															</div>
															<div class="css-1dbjc4n r-18u37iz r-1wbh5a2 r-13hce6t">
																<div class="css-1dbjc4n r-1d09ksm r-18u37iz r-1wbh5a2">
																	<div class="css-1dbjc4n r-1wbh5a2 r-dnmrzs">
																		<a href="/twildr_" role="link" tabindex="-1" class="css-4rbku5 css-18t94o4 css-1dbjc4n r-1loqt21 r-1wbh5a2 r-dnmrzs r-1ny4l3l">
																			<div dir="ltr" class="css-901oao css-1hf3ou5 r-1bwzh9t r-18u37iz r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0"><span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">
																				@twildr_
																		</span></div>
																		</a>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div class="css-1dbjc4n">
										<div class="css-1dbjc4n">
											<div dir="auto" lang="en" class="css-901oao r-1nao33i r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-bnwqim r-qvutc0" id="id__joz34qhhb7" data-testid="tweetText">${summary} - <a href=${source_link} class="css-4rbku5 css-18t94o4 css-901oao css-16my406 r-1cvl2hr r-1loqt21 r-poiln3 r-bcqeeo r-qvutc0" target="_blank" rel="noreferrer">Source: ${source}</a><br><a href=${google_link} class="css-4rbku5 css-18t94o4 css-901oao css-16my406 r-1cvl2hr r-1loqt21 r-poiln3 r-bcqeeo r-qvutc0" target="_blank" rel="noreferrer">More articles</a></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</article>
		</div>
	</div>
</div>
    `
	document.querySelector('[data-testid="cellInnerDiv"]').parentElement.prepend(div)
}

function displayMessage (message) {
	// create a div and add it to the page
	var div = document.createElement("div");
	div.id = "twildr"
	div.style = "position: relative; width: 100%; transition: opacity 0.3s ease-out 0s;"
	div.innerHTML = 
	`
	<div class="css-1dbjc4n r-1igl3o0 r-qklmqi r-1adg3ll r-1ny4l3l">
	<div class="css-1dbjc4n">
		<div class="css-1dbjc4n">
			<article aria-labelledby="id__if2772f7jhf id__uukss43jqwf id__djyr3k7l4vl id__3l9gr9ydh3n id__70yn8ck23rt id__ggg5n7v2e7j id__8qxglqrztmg id__v7ttdz78ylf id__80hxzl0fk5n id__iqzem58zp5 id__joz34qhhb7 id__b59tw0te9bk id__kh2cr2373k id__0g4uni1v84c id__sh5ofnjsxx id__c7umvsnh487 id__7bf6w9qkl id__5z0rvpuaeet id__gyg1htlrmcw" role="article" tabindex="0" class="css-1dbjc4n r-1loqt21 r-18u37iz r-1ny4l3l r-1udh08x r-1qhn6m8 r-i023vh r-o7ynqc r-6416eg" data-testid="tweet">
				<div class="css-1dbjc4n r-eqz5dr r-16y2uox r-1wbh5a2">
					<div class="css-1dbjc4n r-16y2uox r-1wbh5a2 r-1ny4l3l">
						<div class="css-1dbjc4n">
							<div class="css-1dbjc4n">
								<div class="css-1dbjc4n r-18u37iz">
									<div class="css-1dbjc4n r-1iusvr4 r-16y2uox r-ttdzmv"></div>
								</div>
							</div>
							<div class="css-1dbjc4n r-18u37iz">
								<div class="css-1dbjc4n r-1awozwy r-1hwvwag r-18kxxzh r-1b7u577">
									<div class="css-1dbjc4n" data-testid="Tweet-User-Avatar">
										<div class="css-1dbjc4n r-18kxxzh r-1wbh5a2 r-13qz1uu">
											<div class="css-1dbjc4n r-1wbh5a2 r-dnmrzs">
												<div class="css-1dbjc4n r-1adg3ll r-bztko3" data-testid="UserAvatar-Container-TheLondonHughes" style="height: 48px; width: 48px;">
													<div class="r-1adg3ll r-13qz1uu" style="padding-bottom: 100%;"></div>
													<div class="r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-ipm5af r-13qz1uu">
														<div class="css-1dbjc4n r-1adg3ll r-1pi2tsx r-1wyvozj r-bztko3 r-u8s1d r-1v2oles r-desppf r-13qz1uu">
															<div class="r-1adg3ll r-13qz1uu" style="padding-bottom: 100%;"></div>
															<div class="r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-ipm5af r-13qz1uu">
																<div class="css-1dbjc4n r-sdzlij r-ggadg3 r-1udh08x r-u8s1d r-8jfcpp" style="height: calc(100% - -4px); width: calc(100% - -4px);">
																	<a href="/twildr_" aria-hidden="true" role="link" tabindex="-1" class="css-4rbku5 css-18t94o4 css-1dbjc4n r-1niwhzg r-1loqt21 r-1pi2tsx r-1ny4l3l r-o7ynqc r-6416eg r-13qz1uu">
																		<div class="css-1dbjc4n r-sdzlij r-1wyvozj r-1udh08x r-633pao r-u8s1d r-1v2oles r-desppf" style="height: calc(100% - 4px); width: calc(100% - 4px);">
																			<div class="css-1dbjc4n r-1niwhzg r-1pi2tsx r-13qz1uu"></div>
																		</div>
																		<div class="css-1dbjc4n r-sdzlij r-1wyvozj r-1udh08x r-633pao r-u8s1d r-1v2oles r-desppf" style="height: calc(100% - 4px); width: calc(100% - 4px);">
																			<div class="css-1dbjc4n r-kemksi r-1pi2tsx r-13qz1uu"></div>
																		</div>
																		<div class="css-1dbjc4n r-kemksi r-sdzlij r-1wyvozj r-1udh08x r-633pao r-u8s1d r-1v2oles r-desppf" style="height: calc(100% - 4px); width: calc(100% - 4px);">
																			<div class="css-1dbjc4n r-1adg3ll r-1udh08x" style="">
																				<div class="r-1adg3ll r-13qz1uu" style="padding-bottom: 100%;"></div>
																				<div class="r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-ipm5af r-13qz1uu">
																					<div aria-label="" class="css-1dbjc4n r-1p0dtai r-1mlwlqe r-1d2f490 r-1udh08x r-u8s1d r-zchlnj r-ipm5af r-417010">
																						<div class="css-1dbjc4n r-1niwhzg r-vvn4in r-u6sd8q r-4gszlv r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw" style="background-image: url(&quot;https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg&quot;);"></div>
																						<img alt="" draggable="true" src="https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg" class="css-9pa8cd">
																					</div>
																				</div>
																			</div>
																		</div>
																		<div class="css-1dbjc4n r-sdzlij r-1wyvozj r-1udh08x r-u8s1d r-1v2oles r-desppf" style="height: calc(100% - 4px); width: calc(100% - 4px);">
																			<div class="css-1dbjc4n r-172uzmj r-1pi2tsx r-1ny4l3l r-o7ynqc r-6416eg r-13qz1uu"></div>
																		</div>
																	</a>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="css-1dbjc4n r-1iusvr4 r-16y2uox r-1777fci r-kzbkwu">
									<div class="css-1dbjc4n">
										<div class="css-1dbjc4n r-zl2h9q">
											<div class="css-1dbjc4n r-k4xj1c r-18u37iz r-1wtj0ep">
												<div class="css-1dbjc4n r-1d09ksm r-18u37iz r-1wbh5a2">
													<div class="css-1dbjc4n r-1wbh5a2 r-dnmrzs r-1ny4l3l">
														<div class="css-1dbjc4n r-1awozwy r-18u37iz r-1wbh5a2 r-dnmrzs r-1ny4l3l" id="id__70yn8ck23rt" data-testid="User-Names">
															<div class="css-1dbjc4n r-1awozwy r-18u37iz r-1wbh5a2 r-dnmrzs">
																<div class="css-1dbjc4n r-1wbh5a2 r-dnmrzs">
																	<a href="/twildr_" role="link" class="css-4rbku5 css-18t94o4 css-1dbjc4n r-1loqt21 r-1wbh5a2 r-dnmrzs r-1ny4l3l">
																		<div class="css-1dbjc4n r-1awozwy r-18u37iz r-1wbh5a2 r-dnmrzs">
																			<div dir="ltr" class="css-901oao r-1awozwy r-1nao33i r-6koalj r-37j5jr r-a023e6 r-b88u0q r-rjixqe r-bcqeeo r-1udh08x r-3s2u2q r-qvutc0"><span class="css-901oao css-16my406 css-1hf3ou5 r-poiln3 r-bcqeeo r-qvutc0">
																				<span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">TwiLDR</span>
																				</span>
																			</div>
																			<div dir="ltr" class="css-901oao r-1nao33i r-xoduu5 r-18u37iz r-1q142lx r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0">
																				<svg viewBox="0 0 24 24" aria-label="Verified account" role="img" class="r-1cvl2hr r-4qtqp9 r-yyyyoo r-1xvli5t r-9cviqr r-f9ja8p r-og9te1 r-bnwqim r-1plcrui r-lrvibr" data-testid="icon-verified">
																					<g>
																						<path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"></path>
																					</g>
																				</svg>
																			</div>
																		</div>
																	</a>
																</div>
															</div>
															<div class="css-1dbjc4n r-18u37iz r-1wbh5a2 r-13hce6t">
																<div class="css-1dbjc4n r-1d09ksm r-18u37iz r-1wbh5a2">
																	<div class="css-1dbjc4n r-1wbh5a2 r-dnmrzs">
																		<a href="/twildr_" role="link" tabindex="-1" class="css-4rbku5 css-18t94o4 css-1dbjc4n r-1loqt21 r-1wbh5a2 r-dnmrzs r-1ny4l3l">
																			<div dir="ltr" class="css-901oao css-1hf3ou5 r-1bwzh9t r-18u37iz r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0"><span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">
																				@twildr_
																		</span></div>
																		</a>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div class="css-1dbjc4n">
										<div class="css-1dbjc4n">
											<div dir="auto" lang="en" class="css-901oao r-1nao33i r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-bnwqim r-qvutc0" id="id__joz34qhhb7" data-testid="tweetText">${message}<br> </div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</article>
		</div>
	</div>
</div>
    `
	document.querySelector('[data-testid="cellInnerDiv"]').parentElement.prepend(div)
}


function remove() {
  var div = document.getElementById("twildr");
  if (div != null){
    div.remove();
  }
}